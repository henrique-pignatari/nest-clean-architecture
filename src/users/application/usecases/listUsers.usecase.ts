import { UserRepository } from '@/users/domain/repositories/user.repository';
import { UseCase as DefaultUsecase } from '@/shared/application/usecases/use-case';
import { SearchInput } from '@/shared/application/dtos/search-input';
import {
  PaginationOutput,
  PaginationOutputMapper,
} from '@/shared/application/dtos/pagination-output';
import { UserOutput, UserOutputMapper } from '../dtos/user-output';

export namespace ListUsersUseCase {
  export type Input = SearchInput;

  export type Output = PaginationOutput<UserOutput>;

  export class UseCase implements DefaultUsecase<Input, Output> {
    constructor(private userRepository: UserRepository.Repository) {}

    async execute(input: Input): Promise<Output> {
      const params = new UserRepository.SearchParams(input);
      const searchResult = await this.userRepository.search(params);
      return this.toOutput(searchResult);
    }

    private toOutput(searchResult: UserRepository.SearchResult): Output {
      const items = searchResult.items.map(item =>
        UserOutputMapper.toOuput(item),
      );
      return PaginationOutputMapper.toOutput(items, searchResult);
    }
  }
}
