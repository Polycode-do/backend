import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Delete,
  NotFoundException,
  ParseIntPipe,
  Query,
  Put,
  HttpCode,
  DefaultValuePipe,
} from '@nestjs/common';
import { ExerciseService } from './exercise.service';
import { CreateExerciseDto } from './dto/create-exercise.dto';
import { UpdateExerciseDto } from './dto/update-exercise.dto';
import { ApiQuery } from '@nestjs/swagger';

@Controller('exercise')
export class ExerciseController {
  constructor(private readonly exerciseService: ExerciseService) {}

  @Put()
  @HttpCode(201)
  async create(@Body() createExerciseDto: CreateExerciseDto) {
    //TODO Implement authentication logic and replace this dummy with the real user id
    const userId = 1;

    const createdExercise = await this.exerciseService.create(
      userId,
      createExerciseDto,
    );

    return { exerciseId: createdExercise.id };
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
    name: 'creatorId',
    type: Number,
    required: false,
  })
  @Get()
  async findAll(
    @Query('limit', new DefaultValuePipe(100), ParseIntPipe) limit?: number,
    @Query('offset', new DefaultValuePipe(0), ParseIntPipe) offset?: number,
    @Query('creatorId', new DefaultValuePipe(0), ParseIntPipe)
    creatorId?: number,
  ) {
    const exercises = await this.exerciseService.findAll(
      limit,
      offset,
      creatorId === 0 ? {} : { creatorId },
    );

    if (!exercises.length) throw new NotFoundException('Exercises not found');

    return { exercises };
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
    name: 'userId',
    type: Number,
    required: false,
  })
  @Get(':id')
  async findOne(
    @Param('id', ParseIntPipe) id: number,
    @Query('limit', new DefaultValuePipe(100), ParseIntPipe) limit?: number,
    @Query('offset', new DefaultValuePipe(0), ParseIntPipe) offset?: number,
    @Query('userId', new DefaultValuePipe(0), ParseIntPipe) userId?: number,
  ) {
    const exercise = await this.exerciseService.findOne(id);

    if (!exercise) throw new NotFoundException('Exercise not found');

    const completions = await this.exerciseService.getCompletions(
      id,
      limit,
      offset,
      userId === 0 ? {} : { userId },
    );

    return { exercise, completions };
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateExerciseDto: UpdateExerciseDto,
  ) {
    const exercise = await this.exerciseService.findOne(id);

    if (!exercise) throw new NotFoundException('Exercise not found');

    const [count] = await this.exerciseService.update(id, updateExerciseDto);

    return { count };
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    const exercise = await this.exerciseService.findOne(id);

    if (!exercise) throw new NotFoundException('Exercise not found');

    const count = await this.exerciseService.remove(id);

    return { count };
  }
}
