import { PrismaService } from '@/shared/infrastructure/database/prisma/prisma.service';
import { UserEntity } from '@/users/domain/entities/user.entity';
import { UserRepository } from '@/users/domain/repositories/user.repository';
import { NotFoundError } from 'rxjs';
import { UserModelMapper } from '../models/user-model.mapper';

export class UserPrismaRepository implements UserRepository.Repository {
  soratableFields: string[];

  constructor(private prismaService: PrismaService) {}

  async findByEmail(email: string): Promise<UserEntity> {
    throw new Error('Method not implemented.');
  }

  async emailExists(email: string): Promise<void> {
    throw new Error('Method not implemented.');
  }

  async search(
    props: UserRepository.SearchParams,
  ): Promise<UserRepository.SearchResult> {
    throw new Error('Method not implemented.');
  }

  async insert(entity: UserEntity): Promise<void> {
    await this.prismaService.user.create({ data: entity.toJSON() });
  }

  async findById(id: string): Promise<UserEntity> {
    return this._get(id);
  }

  async findAll(): Promise<UserEntity[]> {
    throw new Error('Method not implemented.');
  }

  async update(entity: UserEntity): Promise<void> {
    throw new Error('Method not implemented.');
  }

  async delete(id: string): Promise<void> {
    throw new Error('Method not implemented.');
  }

  protected async _get(id: string): Promise<UserEntity> {
    try {
      const user = await this.prismaService.user.findUnique({
        where: {
          id,
        },
      });

      return UserModelMapper.toEntity(user);
    } catch {
      throw new NotFoundError(`UserModel not found using ID ${id}`);
    }
  }
}
