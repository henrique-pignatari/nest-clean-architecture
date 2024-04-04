import { PrismaClient, User } from '@prisma/client';
import { UserModelMapper } from '../../user-model.mapper';
import { ValidationError } from '@/shared/domain/errors/validation-error';
import { UserEntity } from '@/users/domain/entities/user.entity';
import { setupPrismaTests } from '@/shared/infrastructure/database/prisma/testing/stup-prisma-tests';

describe('UserModelMapper integration tests', () => {
  let prismaService: PrismaClient;
  let props: User;

  beforeAll(async () => {
    setupPrismaTests();

    prismaService = new PrismaClient();
    await prismaService.$connect();
  });

  beforeEach(async () => {
    await prismaService.user.deleteMany();

    props = {
      id: 'ac7d2b04-c2fc-41da-891b-00e0c5c62488',
      name: 'John Doe',
      email: 'a@a.com',
      password: 'password123',
      createdAt: new Date(),
    };
  });

  afterAll(async () => {
    await prismaService.$disconnect();
  });

  it('should throw error when user model is invalid', async () => {
    const model: User = Object.assign(props, { name: null });

    expect(() => UserModelMapper.toEntity(model)).toThrow(ValidationError);
  });

  it('should convert an user model to an UserEntity', async () => {
    const model: User = await prismaService.user.create({ data: props });

    const sut = UserModelMapper.toEntity(model);
    expect(sut).toBeInstanceOf(UserEntity);
    expect(sut.toJSON()).toStrictEqual(props);
  });
});
