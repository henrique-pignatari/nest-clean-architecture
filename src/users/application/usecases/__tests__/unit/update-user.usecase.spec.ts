import { UserInMemoryRepository } from '@/users/infrastructure/database/in-memory/repositories/user-in-memory.repository';
import { UserRepository } from '@/users/domain/repositories/user.repository';
import { NotFoundError } from '@/shared/domain/errors/not-found-error';
import { UserEntity } from '@/users/domain/entities/user.entity';
import { UserDataBuilder } from '@/users/domain/testing/helpers/user-data-builder';
import { UpdateUserUseCase } from '../../update-user.usecase';
import { BadRequestError } from '@/shared/application/errors/bad-request-error';

describe('UpdateUserUseCase unit tests', () => {
  let sut: UpdateUserUseCase.UseCase;
  let repository: UserRepository.Repository;

  beforeEach(() => {
    repository = new UserInMemoryRepository();
    sut = new UpdateUserUseCase.UseCase(repository);
  });

  it('Should throw error when entity not found', async () => {
    await expect(sut.execute({ id: 'fake', name: 'test' })).rejects.toThrow(
      new NotFoundError('Entity not found'),
    );
  });

  it('Should throw error when name not provided', async () => {
    await expect(sut.execute({ id: 'fake', name: '' })).rejects.toThrow(
      new BadRequestError('Name not provided'),
    );
  });

  it('Should be able to update user', async () => {
    const updateSpy = jest.spyOn(repository, 'findById');
    const items = [new UserEntity(UserDataBuilder({}))];
    repository['items'] = items;

    const result = await sut.execute({ id: items[0].id, name: 'name' });

    expect(updateSpy).toHaveBeenCalledTimes(1);
    expect(result).toStrictEqual({ ...items[0].toJSON(), name: 'name' });
  });
});
