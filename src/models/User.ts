import {
  AllowNull,
  Column,
  CreatedAt,
  Default,
  Index,
  IsEmail,
  Length,
  Model,
  Table,
  Unique,
  UpdatedAt,
} from 'sequelize-typescript';

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

  @CreatedAt
  @Column
  createdAt: Date;

  @UpdatedAt
  @Column
  updatedAt: Date;
}
