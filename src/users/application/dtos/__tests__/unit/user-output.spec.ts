import { UserEntity } from '@/users/domain/entities/user.entity';
import { UserDataBuilder } from '@/users/domain/testing/helpers/user-data-builder';
import { UserOutputMapper } from '../../user-output';

describe('UserOutputMapper unit tests', () => {
  it('Should converte an user into an output', () => {
    const entity = new UserEntity(UserDataBuilder({}));
    const toJSONSpy = jest.spyOn(entity, 'toJSON');

    const sut = UserOutputMapper.toOuput(entity);

    expect(toJSONSpy).toHaveBeenCalled();
    expect(sut).toStrictEqual(entity.toJSON());
  });
});
