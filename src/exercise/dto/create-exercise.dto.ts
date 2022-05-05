import { IsNumber, IsOptional, IsString, Length, Min } from 'class-validator';

export class CreateExerciseDto {
  @IsString()
  @Length(3)
  name: string;

  @IsNumber()
  @Min(1)
  challengeId: number;

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
