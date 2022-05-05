import {
  AllowNull,
  BelongsToMany,
  Column,
  CreatedAt,
  Default,
  HasMany,
  Index,
  IsEmail,
  Length,
  Model,
  Table,
  Unique,
  UpdatedAt,
} from 'sequelize-typescript';
import { Challenge, ChallengeCompletion } from './Challenge';
import { Exercise, ExerciseCompletion } from './Exercise';

export enum UserRole {
  ANY = 'any',
  ADMIN = 'admin',
  USER = 'user',
}

@Table({ defaultScope: { attributes: { exclude: ['password'] } } })
export class User extends Model {
  @Default('')
  @Column
  firstName: string;

  @Default('')
  @Column
  lastName: string;

  @IsEmail
  @AllowNull(false)
  @Index
  @Unique
  @Column
  email: string;

  @Length({ min: 6, max: 100 })
  @AllowNull(false)
  @Column
  password: string;

  @Default(UserRole.USER)
  @Column
  role: UserRole;

  @HasMany(() => Exercise, 'creatorId')
  exercisesCreated: Exercise[];

  @HasMany(() => Challenge, 'creatorId')
  challengesCreated: Challenge[];

  @BelongsToMany(
    () => Exercise,
    () => ExerciseCompletion,
    'userId',
    'exerciseId',
  )
  exerciseCompletions: Exercise[];

  @BelongsToMany(
    () => Challenge,
    () => ChallengeCompletion,
    'userId',
    'challengeId',
  )
  challengeCompletions: Challenge[];

  @CreatedAt
  @Column
  createdAt: Date;

  @UpdatedAt
  @Column
  updatedAt: Date;
}
