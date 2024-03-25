import { Entity } from '../../entities/entity';
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

    expect(entity.toJSON()).toStrictEqual(sut.items[0].toJSON());
  });
});
