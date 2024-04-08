import { SortDirection } from '@/shared/domain/repositories/searchable-repository-contracts';
import { ListUsersUseCase } from '@/users/application/usecases/listUsers.usecase';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class ListUsersDto implements ListUsersUseCase.Input {
  @ApiPropertyOptional({ description: 'Page to get' })
  @IsOptional()
  page?: number;

  @ApiPropertyOptional({ description: 'Number of registers by page' })
  @IsOptional()
  perPage?: number;

  @ApiPropertyOptional({
    description: 'Property name to sort data: "name" or "createdAt"',
  })
  @IsOptional()
  sort?: string;

  @ApiPropertyOptional({ description: 'Sort direction: "asc" or "desc"' })
  @IsOptional()
  sortDir?: SortDirection;

  @ApiPropertyOptional({ description: 'Word to filter by property "name"' })
  @IsOptional()
  filter?: string;
}
