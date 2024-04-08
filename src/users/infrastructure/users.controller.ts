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
  UseGuards,
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
import { UserOutput } from '../application/dtos/user-output';
import {
  UserCollectionPresenter,
  UserPresenter,
} from './presenters/user.presenter';
import { AuthService } from '@/auth/infrastructure/auth.service';
import { AuthGuard } from '@/auth/infrastructure/auth.guard';
import {
  ApiBearerAuth,
  ApiResponse,
  ApiTags,
  getSchemaPath,
} from '@nestjs/swagger';

@ApiTags('users')
@Controller('users')
export class UsersController {
  @Inject(SignupUseCase.UseCase)
  private signupUseCase: SignupUseCase.UseCase;

  @Inject(SigninUseCase.UseCase)
  private signinUseCase: SigninUseCase.UseCase;

  @Inject(UpdateUserUseCase.UseCase)
  private updateUserUseCase: UpdateUserUseCase.UseCase;

  @Inject(UpdatePasswordUseCase.UseCase)
  private updatePasswordUseCase: UpdatePasswordUseCase.UseCase;

  @Inject(DeleteUserUseCase.UseCase)
  private deleteUserUseCase: DeleteUserUseCase.UseCase;

  @Inject(GetUserUseCase.UseCase)
  private getUserUseCase: GetUserUseCase.UseCase;

  @Inject(ListUsersUseCase.UseCase)
  private listUsersUseCase: ListUsersUseCase.UseCase;

  @Inject(AuthService)
  private authService: AuthService;

  static userToResponse(output: UserOutput) {
    return new UserPresenter(output);
  }

  static usersListToResponse(output: ListUsersUseCase.Output) {
    return new UserCollectionPresenter(output);
  }

  @ApiResponse({
    status: 409,
    description: 'Email conflict',
  })
  @ApiResponse({
    status: 422,
    description: 'Request body with invalid data',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @Post()
  async create(@Body() signupDto: SignupDto) {
    const output = await this.signupUseCase.execute(signupDto);
    return UsersController.userToResponse(output);
  }

  @ApiResponse({
    status: 200,
    schema: {
      type: 'obejct',
      properties: {
        accessToken: {
          type: 'string',
        },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Email not found',
  })
  @ApiResponse({
    status: 404,
    description: 'Invalid credentials',
  })
  @ApiResponse({
    status: 422,
    description: 'Requisition body with invalid data',
  })
  @HttpCode(200)
  @Post('login')
  async login(@Body() signinDto: SigninDto) {
    const output = await this.signinUseCase.execute(signinDto);
    return this.authService.generateJwt(output.id);
  }

  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    schema: {
      type: 'object',
      properties: {
        meta: {
          type: 'object',
          properties: {
            total: {
              type: 'number',
            },
            currentPage: {
              type: 'number',
            },
            lastPage: {
              type: 'number',
            },
            perPage: {
              type: 'number',
            },
          },
        },
        data: {
          type: 'array',
          items: { $ref: getSchemaPath(UserPresenter) },
        },
      },
    },
  })
  @ApiResponse({
    status: 422,
    description: 'Invalid search params',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @Get()
  @UseGuards(AuthGuard)
  async search(@Query() searchParams: ListUsersDto) {
    const output = await this.listUsersUseCase.execute(searchParams);
    return UsersController.usersListToResponse(output);
  }

  @ApiBearerAuth()
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: 404,
    description: 'Id not found',
  })
  @Get(':id')
  @UseGuards(AuthGuard)
  async findOne(@Param('id') id: string) {
    const output = await this.getUserUseCase.execute({ id });
    return UsersController.userToResponse(output);
  }

  @ApiBearerAuth()
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: 404,
    description: 'Id not found',
  })
  @ApiResponse({
    status: 422,
    description: 'Request body with invalid data',
  })
  @Put(':id')
  @UseGuards(AuthGuard)
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    const output = await this.updateUserUseCase.execute({
      id,
      ...updateUserDto,
    });
    return UsersController.userToResponse(output);
  }

  @ApiBearerAuth()
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: 404,
    description: 'Id not found',
  })
  @ApiResponse({
    status: 422,
    description: 'Request body with invalid data',
  })
  @Patch(':id')
  @UseGuards(AuthGuard)
  async updatePassword(
    @Param('id') id: string,
    @Body() updatePasswordDto: UpdatePasswordDto,
  ) {
    const output = await this.updatePasswordUseCase.execute({
      id,
      ...updatePasswordDto,
    });
    return UsersController.userToResponse(output);
  }

  @ApiBearerAuth()
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: 404,
    description: 'Id not found',
  })
  @ApiResponse({
    status: 204,
    description: 'Delete succeeded',
  })
  @HttpCode(204)
  @Delete(':id')
  @UseGuards(AuthGuard)
  async remove(@Param('id') id: string) {
    await this.deleteUserUseCase.execute({ id });
  }
}
