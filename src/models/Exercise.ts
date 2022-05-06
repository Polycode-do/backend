import {
  AllowNull,
  BelongsTo,
  BelongsToMany,
  Column,
  CreatedAt,
  Default,
  ForeignKey,
  IsNumeric,
  Length,
  Max,
  Min,
  Model,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';
import { Challenge } from './Challenge';
import { User } from './User';

@Table
export class Exercise extends Model {
  @AllowNull(false)
  @Length({ min: 3 })
  @Column
  name: string;

  @Default('')
  @Column
  description: string;

  @Default('')
  @Column
  baseCode: string;

  @AllowNull(false)
  @Length({ min: 3 })
  @Column
  subject: string;

  @IsNumeric
  @ForeignKey(() => Challenge)
  @AllowNull(false)
  @Column
  challengeId: number;

  @BelongsTo(() => Challenge, 'challengeId')
  challenge: Challenge;

  @IsNumeric
  @ForeignKey(() => User)
  @AllowNull(false)
  @Column
  creatorId: number;

  @BelongsTo(() => User, 'creatorId')
  creator: User;

  @BelongsToMany(() => User, () => ExerciseCompletion, 'exerciseId', 'userId')
  completionsTest: User[];

  @CreatedAt
  @Column
  createdAt: Date;

  @UpdatedAt
  @Column
  updatedAt: Date;
}

@Table
export class ExerciseCompletion extends Model {
  @IsNumeric
  @Min(0)
  @Max(100)
  @AllowNull(false)
  @Column
  completion: number;

  @Default(false)
  @Column
  succeeded: boolean;

  @IsNumeric
  @ForeignKey(() => User)
  @AllowNull(false)
  @Column
  userId: number;

  @BelongsTo(() => User, 'userId')
  user: User;

  @IsNumeric
  @ForeignKey(() => Exercise)
  @AllowNull(false)
  @Column
  exerciseId: number;

  @BelongsTo(() => Exercise, 'exerciseId')
  exercise: Exercise;

  @CreatedAt
  @Column
  createdAt: Date;

  @UpdatedAt
  @Column
  updatedAt: Date;
}
