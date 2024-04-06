import { Controller, Get, INestApplication } from '@nestjs/common';
import { ConfilictErrorFilter } from '../../confilict-error.filter';
import { Test, TestingModule } from '@nestjs/testing';
import { ConflictError } from '@/shared/domain/errors/conflict-error copy';
import request from 'supertest';

@Controller('stub')
class StubController {
  @Get()
  async index() {
    throw new ConflictError('Conflicting data');
  }
}

describe('ConfilictErrorFilter', () => {
  let app: INestApplication;
  let module: TestingModule;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      controllers: [StubController],
    }).compile();
    app = module.createNestApplication();
    app.useGlobalFilters(new ConfilictErrorFilter());
    await app.init();
  });

  it('should be defined', () => {
    expect(new ConfilictErrorFilter()).toBeDefined();
  });

  it('should catch a ConflictError', () => {
    return request(app.getHttpServer()).get('/stub').expect(409).expect({
      statusCode: 409,
      error: 'Conflict',
      message: 'Conflicting data',
    });
  });
});
