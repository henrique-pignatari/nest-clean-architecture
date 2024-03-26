import { BcryptjsHashProvider } from '../../bcryptjs-hash.provider';

describe('BcryptjsHashProvider uni tests', () => {
  let sut: BcryptjsHashProvider;

  beforeEach(() => {
    sut = new BcryptjsHashProvider();
  });

  it('Should return an encrypted passsword', async () => {
    const passsword = 'senha12';
    const hash = await sut.generateHash(passsword);

    expect(hash).toBeDefined();
    expect(hash).not.toEqual(passsword);
  });

  it('Should return false on invalid password and hash comparisson', async () => {
    const passsword = 'senha12';
    const hash = await sut.generateHash(passsword);
    const result = await sut.compareHash('fake', hash);

    expect(result).toBeFalsy();
  });

  it('Should return true on valid password and hash comparisson', async () => {
    const passsword = 'senha12';
    const hash = await sut.generateHash(passsword);
    const result = await sut.compareHash(passsword, hash);

    expect(result).toBeTruthy();
  });
});
