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
  Post,
  BadRequestException,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ExerciseService } from './exercise.service';
import { CreateExerciseDto } from './dto/create-exercise.dto';
import { UpdateExerciseDto } from './dto/update-exercise.dto';
import { ApiQuery } from '@nestjs/swagger';
import { ChallengeService } from 'src/challenge/challenge.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { User } from 'src/models/User';

@Controller('exercise')
@UseGuards(JwtAuthGuard)
export class ExerciseController {
  constructor(
    private readonly exerciseService: ExerciseService,
    private readonly challengeService: ChallengeService,
  ) {}

  @Put()
  @HttpCode(201)
  async create(@Body() createExerciseDto: CreateExerciseDto, @Request() req) {
    const user = req.user as User;

    const challenge = await this.challengeService.findOne(
      createExerciseDto.challengeId,
    );

    if (!challenge) throw new BadRequestException('Invalid Challenge');

    const createdExercise = await this.exerciseService.create(
      user.id,
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
    @Request() req,
    @Query('limit', new DefaultValuePipe(100), ParseIntPipe) limit?: number,
    @Query('offset', new DefaultValuePipe(0), ParseIntPipe) offset?: number,
    @Query('creatorId', new DefaultValuePipe(0), ParseIntPipe)
    creatorId?: number,
  ) {
    const currentUser = req.user as User;

    const exercises = await this.exerciseService.findAll(
      currentUser.id,
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

    const challenge = await this.challengeService.findOne(
      updateExerciseDto.challengeId,
    );

    if (!challenge) throw new BadRequestException('Invalid Challenge');

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

  @Post(':id/test')
  async test(@Param('id', ParseIntPipe) id: number, @Request() req) {
    const user = req.user as User;

    const exercise = await this.exerciseService.findOne(id);

    if (!exercise) throw new NotFoundException('Exercise not found');

    //TODO Implement code runner service that return a completion percentage to place in this variable
    const exerciseCompletionAmount = 100;
    let challengeCompletionAmount;

    const [exerciseCompletion] = await this.exerciseService.upsertCompletion({
      exerciseId: id,
      userId: user.id,
      completion: exerciseCompletionAmount,
    });

    if (exerciseCompletionAmount === 100 && !exerciseCompletion.succeeded) {
      const [challengeCompletion] = await this.challengeService.getCompletions(
        exercise.challengeId,
        1,
        0,
        { userId: user.id },
      );

      challengeCompletionAmount = (challengeCompletion?.completion || 0) + 1;

      await this.challengeService.upsertCompletion({
        challengeId: exercise.challengeId,
        userId: user.id,
        completion: challengeCompletionAmount,
      });

      await this.exerciseService.upsertCompletion({
        exerciseId: id,
        userId: user.id,
        completion: 100,
        succeeded: true,
      });
    }

    return {
      exerciseCompletion: exerciseCompletionAmount,
      challengeCompletion: challengeCompletionAmount,
    };
  }
}
