import { UserRepository } from '@/users/domain/repositories/user.repository';
import { UserOutput, UserOutputMapper } from '../dtos/user-output';
import { UseCase as DefaultUsecase } from '@/shared/application/usecases/use-case';
import { InvalidPasswordError } from '@/shared/application/errors/invalid-password-error';
import { HashProvider } from '@/shared/application/providers/hash-provider';

export namespace UpdatePasswordUseCase {
  export type Input = {
    id: string;
    password: string;
    oldPassword: string;
  };

  export type Output = UserOutput;

  export class UseCase implements DefaultUsecase<Input, Output> {
    constructor(
      private userRepository: UserRepository.Repository,
      private hashProvider: HashProvider,
    ) {}

    async execute(input: Input): Promise<Output> {
      const entity = await this.userRepository.findById(input.id);

      if (!input.password || !input.oldPassword) {
        throw new InvalidPasswordError(
          'Old password and newPassword are required',
        );
      }

      const checkOldPassword = await this.hashProvider.compareHash(
        input.oldPassword,
        entity.password,
      );

      if (!checkOldPassword) {
        throw new InvalidPasswordError('Old password does not match');
      }

      const hashPassword = await this.hashProvider.generateHash(input.password);
      entity.updatePassword(hashPassword);
      await this.userRepository.update(entity);
      return UserOutputMapper.toOuput(entity);
    }
  }
}
