import { instanceToPlain } from 'class-transformer';
import { UserPresenter } from '../../user.presenter';

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
