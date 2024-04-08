import { UpdatePasswordUseCase } from '@/users/application/usecases/update-password.usecase copy';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdatePasswordDto
  implements Omit<UpdatePasswordUseCase.Input, 'id'>
{
  @ApiProperty({ description: 'User new password' })
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiProperty({ description: 'User old password' })
  @IsString()
  @IsNotEmpty()
  oldPassword: string;
}
