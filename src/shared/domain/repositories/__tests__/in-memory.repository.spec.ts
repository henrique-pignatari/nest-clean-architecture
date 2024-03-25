import { Entity } from '../../entities/entity';
import { NotFoundError } from '../../errors/not-found-error';
import { InMemoryRepository } from '../in-memory.repository';

type StubEntityProps = {
  nmae: string;
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
    const entity = new StubEnity({ nmae: 'test name', price: 1 });
    await sut.insert(entity);

    expect(sut.items[0].toJSON()).toStrictEqual(entity.toJSON());
  });

  it('Should throw an erro when entity not found', async () => {
    await expect(sut.findById('fakeId')).rejects.toThrow(
      new NotFoundError('Entity not found'),
    );
  });

  it('Should find an entity by id', async () => {
    const entity = new StubEnity({ nmae: 'test name', price: 1 });
    await sut.insert(entity);

    const result = await sut.findById(entity.id);

    expect(result.toJSON()).toStrictEqual(entity.toJSON());
  });

  it('Should return all entities', async () => {
    const entity = new StubEnity({ nmae: 'test name', price: 1 });
    await sut.insert(entity);

    const result = await sut.findAll();

    expect(result).toStrictEqual([entity]);
  });
});
