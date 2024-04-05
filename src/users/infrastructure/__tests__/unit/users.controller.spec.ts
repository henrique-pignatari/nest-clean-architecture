import { UsersController } from '../../users.controller';
import { UserOutput } from '@/users/application/dtos/user-output';
import { SignupUseCase } from '@/users/application/usecases/signup.usecase';
import { SignupDto } from '../../dtos/signup.dto';
import { SigninUseCase } from '@/users/application/usecases/signin.usecase';
import { SigninDto } from '../../dtos/signin.dto';
import { UpdateUserUseCase } from '@/users/application/usecases/update-user.usecase';
import { UpdateUserDto } from '../../dtos/update-user.dto';
import { UpdatePasswordUseCase } from '@/users/application/usecases/update-password.usecase copy';
import { UpdatePasswordDto } from '../../dtos/update-password.dto';
import { DeleteUserUseCase } from '@/users/application/usecases/deleteUser.usecase copy';
import { GetUserUseCase } from '@/users/application/usecases/getUser.usecase';
import { ListUsersUseCase } from '@/users/application/usecases/listUsers.usecase';
import { SearchParams } from '@/shared/domain/repositories/searchable-repository-contracts';
import { ListUsersDto } from '../../dtos/list-users.dto';
import { UserPresenter } from '../../presenters/user.presenter';

describe('UsersController unit tests', () => {
  let sut: UsersController;
  let id: string;
  let props: UserOutput;

  beforeEach(async () => {
    sut = new UsersController();
    id = 'ac7d2b04-c2fc-41da-891b-00e0c5c62488';
    props = {
      id,
      name: 'Jhon Doe',
      email: 'a@a.com',
      password: '1234',
      createdAt: new Date(),
    };
  });

  it('should be defined', () => {
    expect(sut).toBeDefined();
  });

  it('should create a user', async () => {
    const expectedOutput: SignupUseCase.Output = props;

    const mockSignupUseCase = {
      execute: jest.fn().mockReturnValue(Promise.resolve(expectedOutput)),
    };

    sut['signupUseCase'] = mockSignupUseCase as any;

    const input: SignupDto = {
      name: 'Jhon Doe',
      email: 'a@a.com',
      password: '1234',
    };

    const presenter = await sut.create(input);

    expect(presenter).toBeInstanceOf(UserPresenter);
    expect(presenter).toStrictEqual(new UserPresenter(expectedOutput));
    expect(mockSignupUseCase.execute).toHaveBeenCalledWith(input);
  });

  it('should authenticate a user', async () => {
    const expectedOutput: SigninUseCase.Output = props;

    const mockSigninUseCase = {
      execute: jest.fn().mockReturnValue(Promise.resolve(expectedOutput)),
    };

    sut['signinUseCase'] = mockSigninUseCase as any;

    const input: SigninDto = {
      email: 'a@a.com',
      password: '1234',
    };

    const presenter = await sut.login(input);

    expect(presenter).toBeInstanceOf(UserPresenter);
    expect(presenter).toStrictEqual(new UserPresenter(expectedOutput));
    expect(mockSigninUseCase.execute).toHaveBeenCalledWith(input);
  });

  it('should update a user', async () => {
    const expectedOutput: UpdateUserUseCase.Output = props;

    const mockUpdateUserUseCase = {
      execute: jest.fn().mockReturnValue(Promise.resolve(expectedOutput)),
    };

    sut['updateUserUseCase'] = mockUpdateUserUseCase as any;

    const input: UpdateUserDto = {
      name: 'new name',
    };

    const presenter = await sut.update(id, input);

    expect(presenter).toBeInstanceOf(UserPresenter);
    expect(presenter).toStrictEqual(new UserPresenter(expectedOutput));
    expect(mockUpdateUserUseCase.execute).toHaveBeenCalledWith({
      id,
      ...input,
    });
  });

  it('should update a user password', async () => {
    const expectedOutput: UpdatePasswordUseCase.Output = props;

    const mockUpdatePasswordUseCase = {
      execute: jest.fn().mockReturnValue(Promise.resolve(expectedOutput)),
    };

    sut['updatePasswordUseCase'] = mockUpdatePasswordUseCase as any;

    const input: UpdatePasswordDto = {
      password: 'senha123',
      oldPassword: 'senha123',
    };

    const presenter = await sut.updatePassword(id, input);

    expect(presenter).toBeInstanceOf(UserPresenter);
    expect(presenter).toStrictEqual(new UserPresenter(expectedOutput));
    expect(mockUpdatePasswordUseCase.execute).toHaveBeenCalledWith({
      id,
      ...input,
    });
  });

  it('should delete a user', async () => {
    const expectedOutput: DeleteUserUseCase.Output = undefined;

    const mockDeleteUserUseCase = {
      execute: jest.fn().mockReturnValue(Promise.resolve(expectedOutput)),
    };

    sut['deleteUserUseCase'] = mockDeleteUserUseCase as any;

    const result = await sut.remove(id);

    expect(result).toStrictEqual(expectedOutput);
    expect(mockDeleteUserUseCase.execute).toHaveBeenCalledWith({ id });
  });

  it('should find a user', async () => {
    const expectedOutput: GetUserUseCase.Output = props;

    const mockGetUserUseCase = {
      execute: jest.fn().mockReturnValue(Promise.resolve(expectedOutput)),
    };

    sut['getUserUseCase'] = mockGetUserUseCase as any;

    const presenter = await sut.findOne(id);

    expect(presenter).toBeInstanceOf(UserPresenter);
    expect(presenter).toStrictEqual(new UserPresenter(expectedOutput));
    expect(mockGetUserUseCase.execute).toHaveBeenCalledWith({ id });
  });

  it('should list users', async () => {
    const expectedOutput: ListUsersUseCase.Output = {
      items: [props],
      currentPage: 1,
      lastPage: 1,
      perPage: 1,
      total: 1,
    };

    const mockListUsersUseCase = {
      execute: jest.fn().mockReturnValue(Promise.resolve(expectedOutput)),
    };

    sut['listUsersUseCase'] = mockListUsersUseCase as any;

    const searchParams: ListUsersDto = {
      page: 1,
      perPage: 1,
    };

    const result = await sut.search(searchParams);

    expect(result).toStrictEqual(expectedOutput);
    expect(mockListUsersUseCase.execute).toHaveBeenCalledWith(searchParams);
  });
});
