import { IsString } from 'class-validator';

export class TestExerciseDto {
  @IsString()
  code: string;
}
