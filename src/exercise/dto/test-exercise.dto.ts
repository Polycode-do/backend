import { IsString } from 'class-validator';

export class TestExerciseDto {
  @IsString()
  code: string;

  @IsString()
  language: string;
}
