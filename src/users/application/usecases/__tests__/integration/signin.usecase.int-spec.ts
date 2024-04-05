import { DatabaseModule } from '@/shared/infrastructure/database/database.module';
import { setupPrismaTests } from '@/shared/infrastructure/database/prisma/testing/stup-prisma-tests';
import { UserPrismaRepository } from '@/users/infrastructure/database/prisma/repositories/user-prisma.repository';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaClient } from '@prisma/client';
import { HashProvider } from '@/shared/application/providers/hash-provider';
import { BcryptjsHashProvider } from '@/users/infrastructure/providers/hash-provider/bcryptjs-hash.provider';
import { UserEntity } from '@/users/domain/entities/user.entity';
import { UserDataBuilder } from '@/users/domain/testing/helpers/user-data-builder';
import { NotFoundError } from '@/shared/domain/errors/not-found-error';
import { SigninUseCase } from '../../signin.usecase';
import { InvalidCredentialsError } from '@/shared/application/errors/invalid-credentials-error';
import { BadRequestError } from '@/shared/application/errors/bad-request-error';

describe('SigninUseCase integration tests', () => {
  const prismaService = new PrismaClient();
  let sut: SigninUseCase.UseCase;
  let repository: UserPrismaRepository;
  let module: TestingModule;
  let hashProvider: HashProvider;

  beforeAll(async () => {
    setupPrismaTests();

    module = await Test.createTestingModule({
      imports: [DatabaseModule.forTest(prismaService)],
    }).compile();

    repository = new UserPrismaRepository(prismaService as any);
    hashProvider = new BcryptjsHashProvider();
  });

  beforeEach(async () => {
    sut = new SigninUseCase.UseCase(repository, hashProvider);
    await prismaService.user.deleteMany();
  });

  afterAll(async () => {
    await module.close();
  });

  it('should not authenticate unavailable email', async () => {
    const entity = new UserEntity(UserDataBuilder({}));

    await expect(() =>
      sut.execute({
        email: entity.email,
        password: 'newPassword',
      }),
    ).rejects.toThrow(
      new NotFoundError(`UserModel not found using email ${entity.email}`),
    );
  });

  it('should not authenticate with wrong password', async () => {
    const hashPassword = await hashProvider.generateHash('senha123');
    const entity = new UserEntity(
      UserDataBuilder({ email: 'a@a.com', password: hashPassword }),
    );
    const newUser = await prismaService.user.create({
      data: entity.toJSON(),
    });

    await expect(() =>
      sut.execute({
        email: 'a@a.com',
        password: 'wrongPassword',
      }),
    ).rejects.toThrow(new InvalidCredentialsError('Invalid credentials'));
  });

  it('should throw an error when email not provided', async () => {
    await expect(() =>
      sut.execute({
        email: null,
        password: 'newPassword',
      }),
    ).rejects.toThrow(BadRequestError);
  });

  it('should throw an error when email not provided', async () => {
    await expect(() =>
      sut.execute({
        email: 'a@a.com',
        password: null,
      }),
    ).rejects.toThrow(BadRequestError);
  });

  it('should authenticate a user', async () => {
    const hashPassword = await hashProvider.generateHash('senha123');
    const entity = new UserEntity(
      UserDataBuilder({ email: 'a@a.com', password: hashPassword }),
    );
    const newUser = await prismaService.user.create({
      data: entity.toJSON(),
    });

    const output = await sut.execute({
      email: 'a@a.com',
      password: 'senha123',
    });

    expect(output).toStrictEqual(entity.toJSON());
  });
});
