import { instanceToPlain } from 'class-transformer';
import { PaginationPresenter } from '../../pagination.presenter';

describe('PaginationPresenter unit tests', () => {
  describe('constructor', () => {
    it('should reflect props values', () => {
      const props = {
        currentPage: 1,
        perPage: 2,
        lastPage: 3,
        total: 4,
      };
      const sut = new PaginationPresenter(props);

      expect(sut.currentPage).toEqual(props.currentPage);
      expect(sut.perPage).toEqual(props.perPage);
      expect(sut.lastPage).toEqual(props.lastPage);
      expect(sut.total).toEqual(props.total);
    });

    it('should transform to presenter data', () => {
      const props = {
        currentPage: 1,
        perPage: 2,
        lastPage: 3,
        total: 4,
      };

      const sut = new PaginationPresenter(props);
      const output = instanceToPlain(sut);

      expect(output).toStrictEqual({
        currentPage: 1,
        perPage: 2,
        lastPage: 3,
        total: 4,
      });
    });

    it('should transform strings to number', () => {
      const props = {
        currentPage: '1' as any,
        perPage: '2' as any,
        lastPage: '3' as any,
        total: '4' as any,
      };

      const sut = new PaginationPresenter(props);
      const output = instanceToPlain(sut);

      expect(output).toStrictEqual({
        currentPage: 1,
        perPage: 2,
        lastPage: 3,
        total: 4,
      });
    });
  });
});
