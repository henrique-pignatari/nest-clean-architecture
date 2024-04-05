import { DatabaseModule } from '@/shared/infrastructure/database/database.module';
import { setupPrismaTests } from '@/shared/infrastructure/database/prisma/testing/stup-prisma-tests';
import { UserPrismaRepository } from '@/users/infrastructure/database/prisma/repositories/user-prisma.repository';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaClient } from '@prisma/client';
import { NotFoundError } from '@/shared/domain/errors/not-found-error';
import { UserEntity } from '@/users/domain/entities/user.entity';
import { UserDataBuilder } from '@/users/domain/testing/helpers/user-data-builder';
import { ListUsersUseCase } from '../../listUsers.usecase';

describe('ListUsersUseCase integration tests', () => {
  const prismaService = new PrismaClient();
  let sut: ListUsersUseCase.UseCase;
  let repository: UserPrismaRepository;
  let module: TestingModule;

  beforeAll(async () => {
    setupPrismaTests();

    module = await Test.createTestingModule({
      imports: [DatabaseModule.forTest(prismaService)],
    }).compile();

    repository = new UserPrismaRepository(prismaService as any);
  });

  beforeEach(async () => {
    sut = new ListUsersUseCase.UseCase(repository);
    await prismaService.user.deleteMany();
  });

  afterAll(async () => {
    await module.close();
  });

  it('should retrun users ordered by createdAt', async () => {
    const createdAt = new Date();
    const entities: UserEntity[] = [];

    const dataSet = Array(3).fill(UserDataBuilder({}));
    dataSet.forEach((element, index) => {
      entities.push(
        new UserEntity({
          ...element,
          email: `email${index}@mail.com`,
          createdAt: new Date(createdAt.getTime() + index),
        }),
      );
    });

    await prismaService.user.createMany({
      data: entities.map(item => item.toJSON()),
    });

    const output = await sut.execute({});

    expect(output).toStrictEqual({
      items: entities.reverse().map(item => item.toJSON()),
      total: 3,
      currentPage: 1,
      perPage: 15,
      lastPage: 1,
    });
  });

  it('should retrun output applying filter, sort and pagination', async () => {
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

    let output = await sut.execute({
      page: 1,
      perPage: 2,
      sort: 'name',
      sortDir: 'asc',
      filter: 'TEST',
    });

    expect(output).toStrictEqual({
      items: [entities[0].toJSON(), entities[4].toJSON()],
      total: 3,
      currentPage: 1,
      perPage: 2,
      lastPage: 2,
    });

    output = await sut.execute({
      page: 2,
      perPage: 2,
      sort: 'name',
      sortDir: 'asc',
      filter: 'TEST',
    });

    expect(output).toStrictEqual({
      items: [entities[2].toJSON()],
      total: 3,
      currentPage: 2,
      perPage: 2,
      lastPage: 2,
    });
  });
});
