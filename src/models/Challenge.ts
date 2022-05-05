import {
  AllowNull,
  BelongsTo,
  BelongsToMany,
  Column,
  CreatedAt,
  Default,
  ForeignKey,
  HasMany,
  IsNumeric,
  Length,
  Max,
  Min,
  Model,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';
import { Exercise } from './Exercise';
import { User } from './User';

@Table
export class Challenge extends Model {
  @Length({ min: 3 })
  @AllowNull(false)
  @Column
  name: string;

  @Default('')
  @Column
  description: string;

  @HasMany(() => Exercise, 'challengeId')
  exercises: Exercise[];

  @BelongsToMany(() => User, () => ChallengeCompletion, 'challengeId', 'userId')
  completions: User[];

  @IsNumeric
  @AllowNull(false)
  @ForeignKey(() => User)
  @Column
  creatorId: number;

  @BelongsTo(() => User, 'creatorId')
  creator: User;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;
}

@Table
export class ChallengeCompletion extends Model {
  @IsNumeric
  @Min(0)
  @Max(100)
  @AllowNull(false)
  @Column
  completion: number;

  @IsNumeric
  @AllowNull(false)
  @ForeignKey(() => User)
  @Column
  userId: number;

  @BelongsTo(() => User, 'userId')
  user: User;

  @IsNumeric
  @AllowNull(false)
  @ForeignKey(() => Challenge)
  @Column
  challengeId: number;

  @BelongsTo(() => Challenge, 'challengeId')
  challenge: Challenge;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;
}
