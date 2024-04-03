import { UserRepository } from '@/users/domain/repositories/user.repository';
import { BadRequestError } from '../../../shared/application/errors/bad-request-error';
import { UserEntity } from '@/users/domain/entities/user.entity';
import { HashProvider } from '@/shared/application/providers/hash-provider';
import { UserOutput, UserOutputMapper } from '../dtos/user-output';
import { UseCase as DefaultUsecase } from '@/shared/application/usecases/use-case';

export namespace SignupUseCase {
  export type Input = {
    name: string;
    email: string;
    password: string;
  };

  export type Output = UserOutput;

  export class UseCase implements DefaultUsecase<Input, Output> {
    constructor(
      private userRepository: UserRepository.Repository,
      private hashProvider: HashProvider,
    ) {}

    async execute(input: Input): Promise<Output> {
      const { email, name, password } = input;

      if (!email || !name || !password) {
        throw new BadRequestError('Input data not provided');
      }

      const hashPassword = await this.hashProvider.generateHash(password);

      await this.userRepository.emailExists(email);
      const entity = new UserEntity(
        Object.assign(input, {
          password: hashPassword,
        }),
      );
      await this.userRepository.insert(entity);

      return UserOutputMapper.toOuput(entity);
    }
  }
}
