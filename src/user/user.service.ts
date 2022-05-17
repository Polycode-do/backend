import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { hash } from 'bcrypt';
import { Challenge, ChallengeCompletion } from 'src/models/Challenge';
import { Exercise, ExerciseCompletion } from 'src/models/Exercise';
import { User, UserRole } from 'src/models/User';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User)
    private userModel: typeof User,
    @InjectModel(ExerciseCompletion)
    private exerciseCompletionModel: typeof ExerciseCompletion,
    @InjectModel(ChallengeCompletion)
    private challengeCompletionModel: typeof ChallengeCompletion,
  ) {}
  async create(
    createUserDto: CreateUserDto,
    additionalData?: { verified?: boolean; emailToken?: string },
  ) {
    return await this.userModel.create({
      ...createUserDto,
      password: await hash(createUserDto.password, 10),
      ...additionalData,
    });
  }

  async findAll(limit: number, offset: number, filter: { role?: UserRole }) {
    return await this.userModel.findAll({ where: filter, limit, offset });
  }

  async findOne(id: number) {
    return await this.userModel.findByPk(id, {
      include: [
        { model: Exercise, as: 'exercisesCreated' },
        { model: Challenge, as: 'challengesCreated' },
      ],
    });
  }

  async findOneByQuery(query: { email?: string }, include?: string[]) {
    return await this.userModel.findOne({
      where: query,
      include: [
        { model: Exercise, as: 'exercisesCreated' },
        { model: Challenge, as: 'challengesCreated' },
      ],
      attributes: { include },
    });
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    return await this.userModel.update(updateUserDto, { where: { id } });
  }

  async remove(id: number) {
    return await this.userModel.destroy({ where: { id } });
  }

  async getExerciseCompletions(
    userId: number,
    limit: number,
    offset: number,
    filter: { exerciseId?: number },
  ) {
    return await this.exerciseCompletionModel.findAll({
      where: { userId, ...filter },
      limit,
      offset,
      include: [{ model: Exercise, as: 'exercise' }],
    });
  }

  async getChallengeCompletions(
    userId: number,
    limit: number,
    offset: number,
    filter: { challengeId?: number },
  ) {
    return await this.challengeCompletionModel.findAll({
      where: { userId, ...filter },
      limit,
      offset,
      include: [{ model: Challenge, as: 'challenge' }],
    });
  }
}
