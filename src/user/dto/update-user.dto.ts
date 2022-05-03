import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { IsArray, IsEmail, IsString, Length } from 'class-validator';
import { Role } from 'src/models/User';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsEmail()
  email: string;

  @Length(8)
  password: string;

  @IsArray()
  roles: Role[];
}
