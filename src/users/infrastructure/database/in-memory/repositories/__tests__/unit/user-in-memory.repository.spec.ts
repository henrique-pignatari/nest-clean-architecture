import { UserEntity } from '@/users/domain/entities/user.entity';
import { UserInMemoryRepository } from '../../user-in-memory.repository';
import { UserDataBuilder } from '@/users/domain/testing/helpers/user-data-builder';
import { NotFoundError } from '@/shared/domain/errors/not-found-error';
import { ConflictError } from '@/shared/domain/errors/conflict-error copy';

describe('UserInMemoryRepository uni tests', () => {
  let sut: UserInMemoryRepository;

  beforeEach(() => {
    sut = new UserInMemoryRepository();
  });

  it('Should throw error when not found - findByEmail', async () => {
    await expect(sut.findByEmail('a@a.com')).rejects.toThrow(
      new NotFoundError('Entity not found using email a@a.com'),
    );
  });

  it('Should find a entity by email - findByEmail', async () => {
    const entity = new UserEntity(UserDataBuilder({}));
    await sut.insert(entity);
    const result = await sut.findByEmail(entity.email);

    await expect(result.toJSON()).toEqual(entity.toJSON());
  });

  it('Should throw error when not found - emailExists', async () => {
    const entity = new UserEntity(UserDataBuilder({}));
    await sut.insert(entity);
    await expect(sut.emailExists(entity.email)).rejects.toThrow(
      new ConflictError(`Email address already used`),
    );
  });

  it('Should throw error when not found - emailExists', async () => {
    expect.assertions(0);
    await sut.emailExists('a@a.com');
  });

  it('Should not filter items when filter object is null', async () => {
    const entity = new UserEntity(UserDataBuilder({}));

    await sut.insert(entity);
    const result = await sut.findAll();

    const spyFilter = jest.spyOn(result, 'filter');

    const filteredItems = await sut['applyFilter'](result, null);

    expect(spyFilter).not.toHaveBeenCalled();
    await expect(filteredItems).toStrictEqual(result);
  });

  it('Should filter name field using filter param', async () => {
    const items = [
      new UserEntity(UserDataBuilder({ name: 'test' })),
      new UserEntity(UserDataBuilder({ name: 'TEST' })),
      new UserEntity(UserDataBuilder({ name: 'a' })),
    ];

    const spyFilter = jest.spyOn(items, 'filter');

    const filteredItems = await sut['applyFilter'](items, 'test');

    expect(spyFilter).toHaveBeenCalled();
    await expect(filteredItems).toStrictEqual([items[0], items[1]]);
  });

  it('Should sort by createdAt when sort param is null', async () => {
    const createdAt = new Date();
    const items = [
      new UserEntity(UserDataBuilder({ name: 'test', createdAt })),
      new UserEntity(
        UserDataBuilder({
          name: 'TEST',
          createdAt: new Date(createdAt.getTime() + 1),
        }),
      ),
      new UserEntity(
        UserDataBuilder({
          name: 'a',
          createdAt: new Date(createdAt.getTime() + 2),
        }),
      ),
    ];

    const sortedItems = await sut['applySort'](items, null, null);
    await expect(sortedItems).toStrictEqual([items[2], items[1], items[0]]);
  });

  it('Should sort by name field', async () => {
    const items = [
      new UserEntity(UserDataBuilder({ name: 'c' })),
      new UserEntity(UserDataBuilder({ name: 'd' })),
      new UserEntity(UserDataBuilder({ name: 'a' })),
    ];

    let sortedItems = await sut['applySort'](items, 'name', 'asc');
    await expect(sortedItems).toStrictEqual([items[2], items[0], items[1]]);

    sortedItems = await sut['applySort'](items, 'name', null);
    await expect(sortedItems).toStrictEqual([items[1], items[0], items[2]]);
  });
});
