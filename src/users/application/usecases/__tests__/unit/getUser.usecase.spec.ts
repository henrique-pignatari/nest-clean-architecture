import { UserInMemoryRepository } from '@/users/infrastructure/database/in-memory/repositories/user-in-memory.repository';
import { UserRepository } from '@/users/domain/repositories/user.repository';
import { GetUserUseCase } from '../../getUser.usecase';
import { NotFoundError } from '@/shared/domain/errors/not-found-error';
import { UserEntity } from '@/users/domain/entities/user.entity';
import { UserDataBuilder } from '@/users/domain/testing/helpers/user-data-builder';

describe('GetUserUseCase unit tests', () => {
  let sut: GetUserUseCase.UseCase;
  let repository: UserRepository.Repository;

  beforeEach(() => {
    repository = new UserInMemoryRepository();
    sut = new GetUserUseCase.UseCase(repository);
  });

  it('Should throw error when entity not found', async () => {
    await expect(sut.execute({ id: 'fake' })).rejects.toThrow(
      new NotFoundError('Entity not found'),
    );
  });

  it('Should be able to find user', async () => {
    const findByIdSpy = jest.spyOn(repository, 'findById');
    const items = [new UserEntity(UserDataBuilder({}))];
    repository['items'] = items;

    const result = await sut.execute({ id: items[0].id });

    expect(findByIdSpy).toHaveBeenCalledTimes(1);
    expect(result).toStrictEqual(items[0].toJSON());
  });
});
