import {
  IsArray,
  IsEmail,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';
import { Role } from 'src/models/User';

export class CreateUserDto {
  @IsString()
  @IsOptional()
  firstName: string;

  @IsString()
  @IsOptional()
  lastName: string;

  @IsEmail()
  email: string;

  @Length(8)
  password: string;

  @IsArray()
  @IsOptional()
  roles: Role[];
}
