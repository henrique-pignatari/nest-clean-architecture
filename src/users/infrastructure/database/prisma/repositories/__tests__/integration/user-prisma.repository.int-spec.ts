import { PrismaClient } from '@prisma/client';
import { UserPrismaRepository } from '../../user-prisma.repository';
import { Test, TestingModule } from '@nestjs/testing';
import { setupPrismaTests } from '@/shared/infrastructure/database/prisma/testing/stup-prisma-tests';
import { DatabaseModule } from '@/shared/infrastructure/database/database.module';
import { NotFoundError } from '@/shared/domain/errors/not-found-error';
import { UserEntity } from '@/users/domain/entities/user.entity';
import { UserDataBuilder } from '@/users/domain/testing/helpers/user-data-builder';
import { UserRepository } from '@/users/domain/repositories/user.repository';

describe('UserPrismaRepository integration tests', () => {
  const prismaService = new PrismaClient();
  let sut: UserPrismaRepository;
  let module: TestingModule;

  beforeAll(async () => {
    setupPrismaTests();

    module = await Test.createTestingModule({
      imports: [DatabaseModule.forTest(prismaService)],
    }).compile();
  });

  beforeEach(async () => {
    sut = new UserPrismaRepository(prismaService as any);
    await prismaService.user.deleteMany();
  });

  it('should throw error when entity not found', async () => {
    await expect(() => sut.findById('fakeId')).rejects.toThrow(
      new NotFoundError('UserModel not found using ID fakeId'),
    );
  });

  it('should find an entity by id', async () => {
    const entity = new UserEntity(UserDataBuilder({}));
    const newUSer = await prismaService.user.create({
      data: entity.toJSON(),
    });

    const output = await sut.findById(newUSer.id);

    expect(output.toJSON()).toStrictEqual(entity.toJSON());
  });

  it('should insert a new entity', async () => {
    const entity = new UserEntity(UserDataBuilder({}));
    await sut.insert(entity);

    const result = await prismaService.user.findUnique({
      where: {
        id: entity.id,
      },
    });

    expect(result).toStrictEqual(entity.toJSON());
  });

  it('should retrun all users', async () => {
    const entity = new UserEntity(UserDataBuilder({}));
    await prismaService.user.create({ data: entity });

    const entities = await sut.findAll();

    expect(entities).toHaveLength(1);
    entities.map(item => expect(item.toJSON()).toStrictEqual(entity.toJSON()));
  });

  it('should throw error when entity not found on update', async () => {
    const entity = new UserEntity(UserDataBuilder({}));

    await expect(() => sut.update(entity)).rejects.toThrow(
      new NotFoundError(`UserModel not found using ID ${entity.id}`),
    );
  });

  it('should update an entity', async () => {
    const entity = new UserEntity(UserDataBuilder({}));
    await prismaService.user.create({
      data: entity.toJSON(),
    });

    entity.update('new name');
    await sut.update(entity);

    const output = await prismaService.user.findUnique({
      where: {
        id: entity.id,
      },
    });

    expect(output.name).toStrictEqual('new name');
  });

  it('should throw error when entity not found on delete', async () => {
    const entity = new UserEntity(UserDataBuilder({}));

    await expect(() => sut.delete(entity.id)).rejects.toThrow(
      new NotFoundError(`UserModel not found using ID ${entity.id}`),
    );
  });

  it('should delete an entity', async () => {
    const entity = new UserEntity(UserDataBuilder({}));
    await prismaService.user.create({
      data: entity.toJSON(),
    });

    await sut.delete(entity.id);

    const output = await prismaService.user.findUnique({
      where: {
        id: entity.id,
      },
    });

    expect(output).toBeNull();
  });

  describe('search method tests', () => {
    it('should apply only paginate when params are null', async () => {
      const createdAt = new Date();
      const entities: UserEntity[] = [];
      const dataSet = Array(16).fill(UserDataBuilder({}));

      dataSet.forEach((element, index) => {
        entities.push(
          new UserEntity({
            ...element,
            name: `User${index}`,
            email: `test${index}@email.com`,
            createdAt: new Date(createdAt.getTime() + index),
          }),
        );
      });

      await prismaService.user.createMany({
        data: entities.map(item => item.toJSON()),
      });

      const searchOutput = await sut.search(new UserRepository.SearchParams());
      const items = searchOutput.items;

      expect(searchOutput).toBeInstanceOf(UserRepository.SearchResult);
      expect(searchOutput.total).toBe(16);
      expect(items).toHaveLength(15);

      searchOutput.items.forEach(item => {
        expect(item).toBeInstanceOf(UserEntity);
      });

      items.reverse().forEach((item, index) => {
        expect(`test${index + 1}@email.com`).toBe(item.email);
      });
    });

    it('should search applying filter, sort and pagination', async () => {
      const createdAt = new Date();
      const entities: UserEntity[] = [];
      const dataSet = ['test', 'a', 'TEST', 'b', 'TeSt'];

      dataSet.forEach((element, index) => {
        entities.push(
          new UserEntity({
            ...UserDataBuilder({ name: element }),
            createdAt: new Date(createdAt.getTime() + index),
          }),
        );
      });

      await prismaService.user.createMany({
        data: entities.map(item => item.toJSON()),
      });

      const searchOutputPage1 = await sut.search(
        new UserRepository.SearchParams({
          page: 1,
          perPage: 2,
          sort: 'name',
          sortDir: 'asc',
          filter: 'TEST',
        }),
      );

      const searchOutputPage2 = await sut.search(
        new UserRepository.SearchParams({
          page: 2,
          perPage: 2,
          sort: 'name',
          sortDir: 'asc',
          filter: 'TEST',
        }),
      );

      expect(searchOutputPage1.items[0].toJSON()).toStrictEqual(
        entities[0].toJSON(),
      );

      expect(searchOutputPage1.items[1].toJSON()).toStrictEqual(
        entities[4].toJSON(),
      );

      expect(searchOutputPage2.items[0].toJSON()).toStrictEqual(
        entities[2].toJSON(),
      );
    });
  });
});
