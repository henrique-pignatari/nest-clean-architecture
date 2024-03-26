import { UserInMemoryRepository } from '@/users/infrastructure/database/in-memory/repositories/user-in-memory.repository';
import { SignupUseCase } from '../../signup.usecase';
import { HashProvider } from '@/shared/application/providers/hash-provider';
import { BcryptjsHashProvider } from '@/users/infrastructure/providers/hash-provider/bcryptjs-hash.provider';
import { UserRepository } from '@/users/domain/repositories/user.repository';
import { UserDataBuilder } from '@/users/domain/testing/helpers/user-data-builder';
import { ConflictError } from '@/shared/domain/errors/conflict-error copy';
import { BadRequestError } from '@/shared/application/errors/bad-reques-error';

describe('SignupUseCase unit tests', () => {
  let sut: SignupUseCase.UseCase;
  let repository: UserRepository.Repository;
  let hashProvider: HashProvider;

  beforeEach(() => {
    repository = new UserInMemoryRepository();
    hashProvider = new BcryptjsHashProvider();
    sut = new SignupUseCase.UseCase(repository, hashProvider);
  });

  it('Should create a user', async () => {
    const spyInsert = jest.spyOn(repository, 'insert');
    const props = UserDataBuilder({});

    const result = await sut.execute(props);

    expect(result.id).toBeDefined();
    expect(result.createdAt).toBeInstanceOf(Date);
    expect(spyInsert).toHaveBeenCalledTimes(1);
  });

  it('Should not register email duplicate', async () => {
    const props = UserDataBuilder({});

    await sut.execute(props);
    await expect(sut.execute(props)).rejects.toThrow(ConflictError);
  });

  it('Should throw exception when name not provided', async () => {
    const props = Object.assign(UserDataBuilder({}), { name: null });

    await expect(sut.execute(props)).rejects.toThrow(BadRequestError);
  });

  it('Should throw exception when email not provided', async () => {
    const props = Object.assign(UserDataBuilder({}), { email: null });

    await expect(sut.execute(props)).rejects.toThrow(BadRequestError);
  });

  it('Should throw exception when password not provided', async () => {
    const props = Object.assign(UserDataBuilder({}), { password: null });

    await expect(sut.execute(props)).rejects.toThrow(BadRequestError);
  });
});
