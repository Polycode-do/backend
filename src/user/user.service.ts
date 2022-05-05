import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User, UserRole } from 'src/models/User';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User)
    private userModel: typeof User,
  ) {}
  async create(createUserDto: CreateUserDto) {
    return await this.userModel.create({ ...createUserDto });
  }

  async findAll(limit: number, offset: number, filter: { role?: UserRole }) {
    return await this.userModel.findAll({ where: filter, limit, offset });
  }

  async findOne(id: number) {
    return await this.userModel.findByPk(id);
  }

  async findOneByQuery(query: { email?: string }) {
    return await this.userModel.findOne({
      where: query,
    });
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    return await this.userModel.update(updateUserDto, { where: { id } });
  }

  async remove(id: number) {
    return await this.userModel.destroy({ where: { id } });
  }
}
