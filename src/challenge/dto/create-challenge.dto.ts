import { IsOptional, IsString, Length } from 'class-validator';

export class CreateChallengeDto {
  @Length(3)
  name: string;

  @IsString()
  @IsOptional()
  description: string;
}
