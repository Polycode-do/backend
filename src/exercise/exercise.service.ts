import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
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

  async findAll(limit: number, offset: number, filter: { creatorId?: number }) {
    return await this.exerciseModel.findAll({
      where: filter,
      limit,
      offset,
    });
  }

  async findOne(id: number) {
    return await this.exerciseModel.findByPk(id, {
      include: [{ model: User, as: 'creator' }],
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
