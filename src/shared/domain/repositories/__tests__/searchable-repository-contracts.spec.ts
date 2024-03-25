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
  });
});
