import { IsOptional, IsString, Length } from 'class-validator';

export class CreateExerciseDto {
  @IsString()
  @Length(3)
  name: string;

  @IsString()
  @IsOptional()
  description: string;

  @IsString()
  @IsOptional()
  baseCode: string;

  @IsString()
  @Length(3)
  subject: string;
}
