import { instanceToPlain } from 'class-transformer';
import { UserCollectionPresenter, UserPresenter } from '../../user.presenter';
import { PaginationPresenter } from '@/shared/infrastructure/presenter/pagination.presenter';

describe('UserPresenter unit tests', () => {
  const createdAt = new Date();
  const props = {
    id: 'a3adb1eb-6643-40b0-bde6-37f2904800bb',
    name: 'testName',
    email: 'a@a.com',
    password: 'senha123',
    createdAt,
  };
  let sut: UserPresenter;

  beforeEach(() => {
    sut = new UserPresenter(props);
  });

  describe('constructor', () => {
    it('should reflect props values', () => {
      expect(sut.id).toEqual(props.id);
      expect(sut.name).toEqual(props.name);
      expect(sut.email).toEqual(props.email);
      expect(sut.createdAt).toEqual(props.createdAt);
      expect(sut['password']).toBeUndefined();
    });

    it('should transform to presenter', () => {
      const output = instanceToPlain(sut);
      expect(output).toStrictEqual({
        id: 'a3adb1eb-6643-40b0-bde6-37f2904800bb',
        name: 'testName',
        email: 'a@a.com',
        createdAt: createdAt.toISOString(),
      });
    });
  });
});

describe('UserCollectionPresenter unit tests', () => {
  const createdAt = new Date();
  const props = {
    id: 'a3adb1eb-6643-40b0-bde6-37f2904800bb',
    name: 'testName',
    email: 'a@a.com',
    password: 'senha123',
    createdAt,
  };
  describe('constructor', () => {
    it('should reflect props values', () => {
      const sut = new UserCollectionPresenter({
        items: [props],
        currentPage: 1,
        perPage: 2,
        lastPage: 1,
        total: 1,
      });

      expect(sut.meta).toBeInstanceOf(PaginationPresenter);
      expect(sut.meta).toStrictEqual(
        new PaginationPresenter({
          currentPage: 1,
          perPage: 2,
          lastPage: 1,
          total: 1,
        }),
      );

      expect(sut.data).toStrictEqual([new UserPresenter(props)]);
    });

    it('should transform to presenter', () => {
      let sut = new UserCollectionPresenter({
        items: [props],
        currentPage: 1,
        perPage: 2,
        lastPage: 1,
        total: 1,
      });

      let output = instanceToPlain(sut);

      expect(output).toStrictEqual({
        data: [
          {
            id: 'a3adb1eb-6643-40b0-bde6-37f2904800bb',
            name: 'testName',
            email: 'a@a.com',
            createdAt: createdAt.toISOString(),
          },
        ],
        meta: {
          currentPage: 1,
          perPage: 2,
          lastPage: 1,
          total: 1,
        },
      });

      sut = new UserCollectionPresenter({
        items: [props],
        currentPage: '1' as any,
        perPage: '2' as any,
        lastPage: '1' as any,
        total: '1' as any,
      });

      output = instanceToPlain(sut);

      expect(output).toStrictEqual({
        data: [
          {
            id: 'a3adb1eb-6643-40b0-bde6-37f2904800bb',
            name: 'testName',
            email: 'a@a.com',
            createdAt: createdAt.toISOString(),
          },
        ],
        meta: {
          currentPage: 1,
          perPage: 2,
          lastPage: 1,
          total: 1,
        },
      });
    });
  });
});
