import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Challenge } from 'src/models/Challenge';
import { Exercise, ExerciseCompletion } from 'src/models/Exercise';
import { User } from 'src/models/User';
import { CreateExerciseDto } from './dto/create-exercise.dto';
import { UpdateExerciseDto } from './dto/update-exercise.dto';

@Injectable()
export class ExerciseService {
  constructor(
    @InjectModel(Exercise)
    private exerciseModel: typeof Exercise,
    @InjectModel(ExerciseCompletion)
    private exerciseCompletionModel: typeof ExerciseCompletion,
  ) {}

  async create(creatorId: number, createExerciseDto: CreateExerciseDto) {
    return await this.exerciseModel.create({ creatorId, ...createExerciseDto });
  }

  async findAll(
    userId: number,
    limit: number,
    offset: number,
    filter: { creatorId?: number },
  ) {
    const exercises = await this.exerciseModel.findAll({
      where: filter,
      limit,
      offset,
      include: [
        {
          model: User,
          as: 'creator',
          attributes: ['id', 'firstName', 'email'],
        },
        { model: Challenge, as: 'challenge', attributes: ['id', 'name'] },
      ],
    });
    return await Promise.all(
      exercises.map(async (exercise) => {
        return {
          exercise,
          completions: await this.getCompletions(
            exercise.id,
            undefined,
            undefined,
            {
              userId,
            },
          ),
        };
      }),
    );
  }

  async findOne(id: number) {
    return await this.exerciseModel.findByPk(id, {
      include: [
        { model: User, as: 'creator' },
        { model: Challenge, as: 'challenge' },
      ],
    });
  }

  async update(id: number, updateExerciseDto: UpdateExerciseDto) {
    return await this.exerciseModel.update(updateExerciseDto, {
      where: { id },
    });
  }

  async remove(id: number) {
    return await this.exerciseModel.destroy({ where: { id } });
  }

  async getCompletions(
    exerciseId: number,
    limit: number,
    offset: number,
    filter: { userId?: number },
  ) {
    return await this.exerciseCompletionModel.findAll({
      where: { exerciseId, ...filter },
      limit,
      offset,
      include: [{ model: User, as: 'user' }],
    });
  }

  async upsertCompletion(query: {
    exerciseId: number;
    userId: number;
    completion: number;
    succeeded?: boolean;
  }) {
    return await this.exerciseCompletionModel.upsert(query);
  }
}
