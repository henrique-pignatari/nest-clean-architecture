import { CollectionPresenter } from '@/shared/infrastructure/presenter/collection.presenter';
import { UserOutput } from '@/users/application/dtos/user-output';
import { ListUsersUseCase } from '@/users/application/usecases/listUsers.usecase';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class UserPresenter {
  @ApiProperty({ description: 'User Id' })
  id: string;

  @ApiProperty({ description: 'User name' })
  name: string;

  @ApiProperty({ description: 'User email' })
  email: string;

  @ApiProperty({ description: 'User creation date' })
  @Transform(({ value }: { value: Date }) => value.toISOString())
  createdAt: Date;

  constructor(output: UserOutput) {
    this.id = output.id;
    this.name = output.name;
    this.email = output.email;
    this.createdAt = output.createdAt;
  }
}

export class UserCollectionPresenter extends CollectionPresenter {
  data: UserPresenter[];

  constructor(output: ListUsersUseCase.Output) {
    const { items, ...paginationProps } = output;
    super(paginationProps);
    this.data = items.map(item => new UserPresenter(item));
  }
}
