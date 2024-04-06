import { ConflictError } from '@/shared/domain/errors/conflict-error copy';
import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { FastifyReply } from 'fastify';

@Catch(ConflictError)
export class ConfilictErrorFilter implements ExceptionFilter {
  catch(exception: ConflictError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<FastifyReply>();

    response.status(409).send({
      statusCode: 409,
      error: 'Conflict',
      message: exception.message,
    });
  }
}
