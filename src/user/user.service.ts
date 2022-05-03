import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { Role, User } from 'src/models/User';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User)
    private userModel: typeof User,
  ) {}
  async create(createUserDto: CreateUserDto) {
    try {
      return await this.userModel.create({ ...createUserDto });
    } catch (error) {
      throw new HttpException('Internal server error', 500);
    }
  }

  async findAll(limit?: number, offset?: number, roles?: Role[]) {
    try {
      return {
        users: await this.userModel.findAll({
          where: { roles: { [Op.in]: roles } },
          limit,
          offset,
        }),
        total: await this.userModel.count(),
      };
    } catch (error) {
      throw new HttpException('Internal server error', 500);
    }
  }

  async findOne(id: string) {
    try {
      return await this.userModel.findOne({ where: { id } });
    } catch (error) {
      throw new HttpException('Internal server error', 500);
    }
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    try {
      return await this.userModel.update(
        { ...updateUserDto },
        { where: { id } },
      );
    } catch (error) {
      throw new HttpException('Internal server error', 500);
    }
  }

  async remove(id: string) {
    try {
      return await this.userModel.destroy({ where: { id } });
    } catch (error) {
      throw new HttpException('Internal server error', 500);
    }
  }
}
