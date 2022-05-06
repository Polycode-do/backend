import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Challenge, ChallengeCompletion } from 'src/models/Challenge';
import { Exercise } from 'src/models/Exercise';
import { User } from 'src/models/User';
import { CreateChallengeDto } from './dto/create-challenge.dto';
import { UpdateChallengeDto } from './dto/update-challenge.dto';

@Injectable()
export class ChallengeService {
  constructor(
    @InjectModel(Challenge)
    private challengeModel: typeof Challenge,
    @InjectModel(ChallengeCompletion)
    private challengeCompletionModel: typeof ChallengeCompletion,
  ) {}
  async create(creatorId: number, createChallengeDto: CreateChallengeDto) {
    return await this.challengeModel.create({
      creatorId,
      ...createChallengeDto,
    });
  }

  async findAll(limit: number, offset: number, filter: { creatorId?: number }) {
    return await this.challengeModel.findAll({
      where: filter,
      limit,
      offset,
    });
  }

  async findOne(id: number) {
    return await this.challengeModel.findByPk(id, {
      include: [
        { model: User, as: 'creator' },
        { model: Exercise, as: 'exercises' },
      ],
    });
  }

  async update(id: number, updateChallengeDto: UpdateChallengeDto) {
    return await this.challengeModel.update(updateChallengeDto, {
      where: { id },
    });
  }

  async remove(id: number) {
    return await this.challengeModel.destroy({ where: { id } });
  }

  async getCompletions(
    challengeId: number,
    limit: number,
    offset: number,
    filter: { userId?: number },
  ) {
    return await this.challengeCompletionModel.findAll({
      where: { challengeId, ...filter },
      limit,
      offset,
      include: [{ model: User, as: 'user' }],
    });
  }

  async upsertCompletion(query: {
    challengeId: number;
    userId: number;
    completion: number;
  }) {
    return await this.challengeCompletionModel.upsert(query);
  }
}
