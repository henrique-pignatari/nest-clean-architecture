import { UserInMemoryRepository } from '@/users/infrastructure/database/in-memory/repositories/user-in-memory.repository';
import { UserRepository } from '@/users/domain/repositories/user.repository';
import { NotFoundError } from '@/shared/domain/errors/not-found-error';
import { UserEntity } from '@/users/domain/entities/user.entity';
import { UserDataBuilder } from '@/users/domain/testing/helpers/user-data-builder';
import { UpdatePasswordUseCase } from '../../update-password.usecase copy';
import { HashProvider } from '@/shared/application/providers/hash-provider';
import { BcryptjsHashProvider } from '@/users/infrastructure/providers/hash-provider/bcryptjs-hash.provider';
import { InvalidPasswordError } from '@/shared/application/errors/invalid-password-error';

describe('UpdatePasswordUseCase unit tests', () => {
  let sut: UpdatePasswordUseCase.UseCase;
  let repository: UserRepository.Repository;
  let hashProvider: HashProvider;

  beforeEach(() => {
    repository = new UserInMemoryRepository();
    hashProvider = new BcryptjsHashProvider();
    sut = new UpdatePasswordUseCase.UseCase(repository, hashProvider);
  });

  it('Should throw error when entity not found', async () => {
    await expect(
      sut.execute({ id: 'fake', password: 'test', oldPassword: 'teste2' }),
    ).rejects.toThrow(new NotFoundError('Entity not found'));
  });

  it('Should throw error when oldPassword not provided', async () => {
    const entity = new UserEntity(UserDataBuilder({}));
    repository['items'] = [entity];

    await expect(
      sut.execute({ id: entity.id, password: 'test', oldPassword: '' }),
    ).rejects.toThrow(
      new InvalidPasswordError('Old password and newPassword are required'),
    );
  });

  it('Should throw error when password not provided', async () => {
    const entity = new UserEntity(UserDataBuilder({ password: 'teste2' }));
    repository['items'] = [entity];

    await expect(
      sut.execute({ id: entity.id, password: '', oldPassword: 'teste2' }),
    ).rejects.toThrow(
      new InvalidPasswordError('Old password and newPassword are required'),
    );
  });

  it('Should throw error when oldPassword does not match', async () => {
    const hashPassword = await hashProvider.generateHash('correta');
    const entity = new UserEntity(UserDataBuilder({ password: hashPassword }));
    repository['items'] = [entity];

    await expect(
      sut.execute({
        id: entity.id,
        password: 'teste',
        oldPassword: 'incorreta',
      }),
    ).rejects.toThrow(new InvalidPasswordError('Old password does not match'));

    await expect(
      sut.execute({
        id: entity.id,
        password: 'teste',
        oldPassword: 'correta',
      }),
    ).resolves.not.toThrow(
      new InvalidPasswordError('Old password does not match'),
    );
  });

  it('Should be able to update user', async () => {
    const hashPassword = await hashProvider.generateHash('correta');
    const updateSpy = jest.spyOn(repository, 'update');
    const items = [new UserEntity(UserDataBuilder({ password: hashPassword }))];
    repository['items'] = items;

    const result = await sut.execute({
      id: items[0].id,
      password: 'teste',
      oldPassword: 'correta',
    });

    const checkNewPassword = await hashProvider.compareHash(
      'teste',
      result.password,
    );

    expect(updateSpy).toHaveBeenCalledTimes(1);
    expect(checkNewPassword).toBeTruthy();
  });
});
