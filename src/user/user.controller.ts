import {
  Controller,
  Get,
  Put,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  ParseIntPipe,
  BadRequestException,
  Query,
  NotFoundException,
  DefaultValuePipe,
  ParseEnumPipe,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserRole } from 'src/models/User';
import { ApiQuery } from '@nestjs/swagger';
import { hash } from 'bcrypt';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';

@Controller('user')
@UseGuards(JwtAuthGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Put()
  @HttpCode(201)
  async create(@Body() createUserDto: CreateUserDto) {
    const user = await this.userService.findOneByQuery({
      email: createUserDto.email,
    });

    if (user) throw new BadRequestException('User already exists');

    const createdUser = await this.userService.create(createUserDto);

    return { userId: createdUser.id };
  }

  @Get()
  @ApiQuery({
    name: 'role',
    type: String,
    enum: UserRole,
    required: false,
  })
  @ApiQuery({
    name: 'limit',
    type: Number,
    required: false,
  })
  @ApiQuery({
    name: 'offset',
    type: Number,
    required: false,
  })
  async findAll(
    @Query('limit', new DefaultValuePipe(100), ParseIntPipe) limit?: number,
    @Query('offset', new DefaultValuePipe(0), ParseIntPipe) offset?: number,
    @Query(
      'role',
      new DefaultValuePipe(UserRole.ANY),
      new ParseEnumPipe(UserRole),
    )
    role?: UserRole,
  ) {
    const users = await this.userService.findAll(
      limit,
      offset,
      role == UserRole.ANY ? {} : { role },
    );

    if (!users.length) throw new NotFoundException('Users not found');

    return { users };
  }

  @ApiQuery({
    name: 'limit',
    type: Number,
    required: false,
  })
  @ApiQuery({
    name: 'offset',
    type: Number,
    required: false,
  })
  @ApiQuery({
    name: 'exerciseId',
    type: Number,
    required: false,
  })
  @ApiQuery({
    name: 'challengeId',
    type: Number,
    required: false,
  })
  @Get(':id')
  async findOne(
    @Param('id', ParseIntPipe) id: number,
    @Query('limit', new DefaultValuePipe(100), ParseIntPipe) limit?: number,
    @Query('offset', new DefaultValuePipe(0), ParseIntPipe) offset?: number,
    @Query('exerciseId', new DefaultValuePipe(0), ParseIntPipe)
    exerciseId?: number,
    @Query('challengeId', new DefaultValuePipe(0), ParseIntPipe)
    challengeId?: number,
  ) {
    const user = await this.userService.findOne(id);

    if (!user) throw new NotFoundException('User not found');

    const exerciseCompletions = await this.userService.getExerciseCompletions(
      id,
      limit,
      offset,
      exerciseId === 0 ? {} : { exerciseId },
    );

    const challengeCompletions = await this.userService.getChallengeCompletions(
      id,
      limit,
      offset,
      challengeId === 0 ? {} : { challengeId },
    );

    return { user, exerciseCompletions, challengeCompletions };
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    const user = await this.userService.findOne(id);

    if (!user) throw new NotFoundException('User not found');

    const hashedPassword = await hash(updateUserDto.password, 10);

    const [count] = await this.userService.update(id, {
      ...updateUserDto,
      password: hashedPassword,
    });

    return { count };
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    const user = await this.userService.findOne(id);

    if (!user) throw new NotFoundException('User not found');

    const count = await this.userService.remove(id);

    return { count };
  }
}
