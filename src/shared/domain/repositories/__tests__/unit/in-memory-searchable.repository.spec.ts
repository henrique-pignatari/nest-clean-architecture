import { Entity } from '@/shared/domain/entities/entity';
import { InMemorySearchableRepository } from '../../in-memory-searchable.repository';

type StubEntityProps = {
  name: string;
  price: number;
};

class StubEnity extends Entity<StubEntityProps> {}

class StubInMemorySearchableRepository extends InMemorySearchableRepository<StubEnity> {
  soratableField: string[] = ['name'];

  protected async applyFilter(
    items: StubEnity[],
    filter: string | null,
  ): Promise<StubEnity[]> {
    if (!filter) {
      return items;
    }

    return items.filter(item =>
      item.props.name.toLowerCase().includes(filter.toLowerCase()),
    );
  }
}

describe('InMemorySearchableRepository uni tests', () => {
  let sut: StubInMemorySearchableRepository;

  beforeEach(() => {
    sut = new StubInMemorySearchableRepository();
  });

  describe('applyFilter method', () => {
    it('should not filter items when filter is null', async () => {
      const items = [
        new StubEnity({ name: 'test', price: 1 }),
        new StubEnity({ name: 'TEST', price: 1 }),
        new StubEnity({ name: 'fake', price: 1 }),
      ];

      const spyFilterMethod = jest.spyOn(items, 'filter');

      const filteredItems = await sut['applyFilter'](items, null);

      expect(filteredItems).toStrictEqual(items);
      expect(spyFilterMethod).not.toHaveBeenCalled();
    });

    it('should filter items using filter param', async () => {
      const items = [
        new StubEnity({ name: 'test', price: 1 }),
        new StubEnity({ name: 'TEST', price: 1 }),
        new StubEnity({ name: 'fake', price: 1 }),
      ];

      const spyFilterMethod = jest.spyOn(items, 'filter');
      let filteredItems = await sut['applyFilter'](items, 'TEST');

      expect(filteredItems).toStrictEqual([items[0], items[1]]);
      expect(spyFilterMethod).toHaveBeenCalledTimes(1);

      filteredItems = await sut['applyFilter'](items, 'test');

      expect(filteredItems).toStrictEqual([items[0], items[1]]);
      expect(spyFilterMethod).toHaveBeenCalledTimes(2);

      filteredItems = await sut['applyFilter'](items, 'none');

      expect(filteredItems).toHaveLength(0);
      expect(spyFilterMethod).toHaveBeenCalledTimes(3);
    });
  });
});
