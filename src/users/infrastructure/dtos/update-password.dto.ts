import { UpdatePasswordUseCase } from '@/users/application/usecases/update-password.usecase copy';

export class UpdatePasswordDto
  implements Omit<UpdatePasswordUseCase.Input, 'id'>
{
  password: string;
  oldPassword: string;
}
