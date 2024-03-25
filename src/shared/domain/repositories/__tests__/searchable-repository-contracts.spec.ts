import { SearchParams } from '../searchable-repository-contracts';

describe('SearchableRepository', () => {
  describe('searchParams tests', () => {
    it('page prop', () => {
      let sut = new SearchParams();

      expect(sut.page).toBe(1);

      const params = [
        { page: null as any, expect: 1 },
        { page: undefined as any, expect: 1 },
        { page: '' as any, expect: 1 },
        { page: 'test' as any, expect: 1 },
        { page: 0, expect: 1 },
        { page: -1, expect: 1 },
        { page: true, expect: 1 },
        { page: false, expect: 1 },
        { page: {}, expect: 1 },
        { page: 1, expect: 1 },
        { page: 2, expect: 2 },
      ];

      params.forEach(item => {
        sut = new SearchParams({ page: item.page });
        expect(sut.page).toBe(item.expect);
      });
    });

    it('perPage prop', () => {
      let sut = new SearchParams();

      expect(sut.perPage).toBe(15);

      const params = [
        { perPage: null as any, expect: 15 },
        { perPage: undefined as any, expect: 15 },
        { perPage: '' as any, expect: 15 },
        { perPage: 'test' as any, expect: 15 },
        { perPage: 0, expect: 15 },
        { perPage: -1, expect: 15 },
        { perPage: true, expect: 15 },
        { perPage: false, expect: 15 },
        { perPage: {}, expect: 15 },
        { perPage: 1, expect: 1 },
        { perPage: 2, expect: 2 },
        { perPage: 25, expect: 25 },
      ];

      params.forEach(item => {
        sut = new SearchParams({ perPage: item.perPage });
        expect(sut.perPage).toBe(item.expect);
      });
    });

    it('sort prop', () => {
      let sut = new SearchParams();

      expect(sut.sort).toBeNull();

      const params = [
        { sort: null as any, expect: null },
        { sort: undefined as any, expect: null },
        { sort: '', expect: null },
        { sort: 'test', expect: 'test' },
        { sort: 0, expect: '0' },
        { sort: -1, expect: '-1' },
        { sort: 5.5, expect: '5.5' },
        { sort: true, expect: 'true' },
        { sort: false, expect: 'false' },
        { sort: {}, expect: '[object Object]' },
        { sort: 1, expect: '1' },
        { sort: 2, expect: '2' },
        { sort: 25, expect: '25' },
      ];

      params.forEach(item => {
        sut = new SearchParams({ sort: item.sort });
        expect(sut.sort).toBe(item.expect);
      });
    });

    it('sortDir prop', () => {
      let sut = new SearchParams();
      expect(sut.sortDir).toBeNull();

      sut = new SearchParams({ sort: null });
      expect(sut.sortDir).toBeNull();

      sut = new SearchParams({ sort: undefined });
      expect(sut.sortDir).toBeNull();

      sut = new SearchParams({ sort: '' });
      expect(sut.sortDir).toBeNull();

      const params = [
        { sortDir: null as any, expect: 'desc' },
        { sortDir: undefined as any, expect: 'desc' },
        { sortDir: '', expect: 'desc' },
        { sortDir: 'test', expect: 'desc' },
        { sortDir: 0, expect: 'desc' },
        { sortDir: 'asc', expect: 'asc' },
        { sortDir: 'ASC', expect: 'asc' },
        { sortDir: 'desc', expect: 'desc' },
        { sortDir: 'DESC', expect: 'desc' },
      ];

      params.forEach(item => {
        sut = new SearchParams({ sort: 'field', sortDir: item.sortDir });
        expect(sut.sortDir).toBe(item.expect);
      });
    });

    it('filter prop', () => {
      let sut = new SearchParams();

      expect(sut.filter).toBeNull();

      const params = [
        { filter: null as any, expect: null },
        { filter: undefined as any, expect: null },
        { filter: '', expect: null },
        { filter: 'test', expect: 'test' },
        { filter: 0, expect: '0' },
        { filter: -1, expect: '-1' },
        { filter: 5.5, expect: '5.5' },
        { filter: true, expect: 'true' },
        { filter: false, expect: 'false' },
        { filter: {}, expect: '[object Object]' },
        { filter: 1, expect: '1' },
        { filter: 2, expect: '2' },
        { filter: 25, expect: '25' },
      ];

      params.forEach(item => {
        sut = new SearchParams({ filter: item.filter });
        expect(sut.filter).toBe(item.expect);
      });
    });
  });
});
