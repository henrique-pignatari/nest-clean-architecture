import { UserRepository } from '@/users/domain/repositories/user.repository';
import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaClient } from '@prisma/client';
import { setupPrismaTests } from '@/shared/infrastructure/database/prisma/testing/stup-prisma-tests';
import { EnvConfigModule } from '@/shared/infrastructure/env-config/env-config.module';
import { UsersModule } from '../../users.module';
import { DatabaseModule } from '@/shared/infrastructure/database/database.module';
import request from 'supertest';
import { applyGlobalConfig } from '@/global-config';
import { UserEntity } from '@/users/domain/entities/user.entity';
import { UserDataBuilder } from '@/users/domain/testing/helpers/user-data-builder';
import { HashProvider } from '@/shared/application/providers/hash-provider';
import { BcryptjsHashProvider } from '../../providers/hash-provider/bcryptjs-hash.provider';

describe('UserController remove e2e tests', () => {
  let app: INestApplication;
  let module: TestingModule;
  let repository: UserRepository.Repository;
  let hashProvider: HashProvider;
  const prismaService = new PrismaClient();

  let entity: UserEntity;
  let hashPassword: string;
  let accessToken: string;

  beforeAll(async () => {
    setupPrismaTests();
    module = await Test.createTestingModule({
      imports: [
        EnvConfigModule,
        UsersModule,
        DatabaseModule.forTest(prismaService),
      ],
    }).compile();

    app = module.createNestApplication();
    applyGlobalConfig(app);
    await app.init();
    repository = module.get<UserRepository.Repository>('UserRepository');
    hashProvider = new BcryptjsHashProvider();
    hashPassword = await hashProvider.generateHash('1234');
  });

  beforeEach(async () => {
    await prismaService.user.deleteMany();
    entity = new UserEntity(
      UserDataBuilder({ email: 'a@a.com', password: hashPassword }),
    );
    await repository.insert(entity);

    const loginResponse = await request(app.getHttpServer())
      .post('/users/login')
      .send({ email: 'a@a.com', password: '1234' })
      .expect(200);

    accessToken = loginResponse.body.accessToken;
  });

  describe('DELETE /users/:id', () => {
    it('should delete a user by id', async () => {
      const res = await request(app.getHttpServer())
        .delete(`/users/${entity.id}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(204)
        .expect({});
    });

    it('should return an error with 404 code when deleting user with unexisting id', async () => {
      const res = await request(app.getHttpServer())
        .delete(`/users/fakeId`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(404)
        .expect({
          statusCode: 404,
          error: 'Not Found',
          message: 'UserModel not found using ID fakeId',
        });
    });

    it('should return an error with 401 code when no bearer specified', async () => {
      const res = await request(app.getHttpServer())
        .delete(`/users/fakeId`)
        .expect(401)
        .expect({
          statusCode: 401,
          message: 'Unauthorized',
        });
    });
  });
});
