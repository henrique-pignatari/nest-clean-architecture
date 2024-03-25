import { Entity } from '../../entities/entity';
import { NotFoundError } from '../../errors/not-found-error';
import { InMemoryRepository } from '../in-memory.repository';

type StubEntityProps = {
  name: string;
  price: number;
};

class StubEnity extends Entity<StubEntityProps> {}

class StubInMemoryRepository extends InMemoryRepository<StubEnity> {}

describe('InMemoryRepository uni tests', () => {
  let sut: StubInMemoryRepository;

  beforeEach(() => {
    sut = new StubInMemoryRepository();
  });

  it('Should insert a new entity', async () => {
    const entity = new StubEnity({ name: 'test name', price: 1 });
    await sut.insert(entity);

    expect(sut.items[0].toJSON()).toStrictEqual(entity.toJSON());
  });

  it('Should throw an error when entity not found', async () => {
    await expect(sut.findById('fakeId')).rejects.toThrow(
      new NotFoundError('Entity not found'),
    );
  });

  it('Should find an entity by id', async () => {
    const entity = new StubEnity({ name: 'test name', price: 1 });
    await sut.insert(entity);

    const result = await sut.findById(entity.id);

    expect(result.toJSON()).toStrictEqual(entity.toJSON());
  });

  it('Should return all entities', async () => {
    const entity = new StubEnity({ name: 'test name', price: 1 });
    await sut.insert(entity);

    const result = await sut.findAll();

    expect(result).toStrictEqual([entity]);
  });

  it('Should throw an error on update when entity not found', async () => {
    const entity = new StubEnity({ name: 'test name', price: 1 });

    await expect(sut.update(entity)).rejects.toThrow(
      new NotFoundError('Entity not found'),
    );
  });

  it('Should update an entity', async () => {
    const entity = new StubEnity({ name: 'test name', price: 1 });
    await sut.insert(entity);

    const entityUpdated = new StubEnity(
      {
        name: 'test name',
        price: 1,
      },
      entity.id,
    );

    await sut.update(entityUpdated);

    const result = await sut.findById(entity.id);
    expect(result.toJSON()).toStrictEqual(entityUpdated.toJSON());
  });

  it('Should throw an error on delete when entity not found', async () => {
    await expect(sut.delete('fakeId')).rejects.toThrow(
      new NotFoundError('Entity not found'),
    );
  });

  it('Should update an entity', async () => {
    const entity = new StubEnity({ name: 'test name', price: 1 });
    await sut.insert(entity);

    await sut.delete(entity.id);

    expect(sut.items).toHaveLength(0);
  });
});
