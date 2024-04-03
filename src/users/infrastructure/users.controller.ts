import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Inject,
  HttpCode,
  Query,
  Put,
} from '@nestjs/common';
import { SignupDto } from './dtos/signup.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { SignupUseCase } from '../application/usecases/signup.usecase';
import { SigninUseCase } from '../application/usecases/signin.usecase';
import { UpdateUserUseCase } from '../application/usecases/update-user.usecase';
import { UpdatePasswordUseCase } from '../application/usecases/update-password.usecase copy';
import { DeleteUserUseCase } from '../application/usecases/deleteUser.usecase copy';
import { GetUserUseCase } from '../application/usecases/getUser.usecase';
import { ListUsersUseCase } from '../application/usecases/listUsers.usecase';
import { SigninDto } from './dtos/signin.dto';
import { ListUsersDto } from './dtos/list-users.dto';
import { UpdatePasswordDto } from './dtos/update-password.dto';

@Controller('users')
export class UsersController {
  @Inject(SignupUseCase.UseCase)
  private readonly signupUseCase: SignupUseCase.UseCase;

  @Inject(SigninUseCase.UseCase)
  private readonly signinUseCase: SigninUseCase.UseCase;

  @Inject(UpdateUserUseCase.UseCase)
  private readonly updateUserUseCase: UpdateUserUseCase.UseCase;

  @Inject(UpdatePasswordUseCase.UseCase)
  private readonly updatePasswordUseCase: UpdatePasswordUseCase.UseCase;

  @Inject(DeleteUserUseCase.UseCase)
  private readonly deleteUserUseCase: DeleteUserUseCase.UseCase;

  @Inject(GetUserUseCase.UseCase)
  private readonly getUserUseCase: GetUserUseCase.UseCase;

  @Inject(ListUsersUseCase.UseCase)
  private readonly listUsersUseCase: ListUsersUseCase.UseCase;

  @Post()
  async create(@Body() signupDto: SignupDto) {
    return this.signupUseCase.execute(signupDto);
  }

  @HttpCode(200)
  @Post('login')
  async login(@Body() signinDto: SigninDto) {
    return this.signinUseCase.execute(signinDto);
  }

  @Get()
  async search(@Query() searchParams: ListUsersDto) {
    return this.listUsersUseCase.execute(searchParams);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.getUserUseCase.execute({ id });
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.updateUserUseCase.execute({ id, ...updateUserDto });
  }

  @Patch(':id')
  async updatePassword(
    @Param('id') id: string,
    @Body() updatePasswordDto: UpdatePasswordDto,
  ) {
    return this.updatePasswordUseCase.execute({ id, ...updatePasswordDto });
  }

  @HttpCode(204)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.deleteUserUseCase.execute({ id });
  }
}
