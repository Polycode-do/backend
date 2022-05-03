import {
  Column,
  CreatedAt,
  DataType,
  Default,
  Index,
  IsEmail,
  Length,
  Model,
  Table,
  Unique,
  UpdatedAt,
} from 'sequelize-typescript';

export enum Role {
  READ_USERS = 'READ_USERS',
  READ_ALL_USERS = 'READ_ALL_USERS',
  WRITE_USERS = 'WRITE_USERS',
}

@Table({
  defaultScope: {
    attributes: {
      exclude: ['password'],
    },
  },
})
export class User extends Model {
  @Default('')
  @Column
  firstName: string;

  @Default('')
  @Column
  lastName: string;

  @IsEmail
  @Index
  @Unique
  @Column
  email: string;

  @Length({ min: 8 })
  @Column
  password: string;

  @Default([])
  @Column({
    type: DataType.ARRAY(
      DataType.ENUM(Role.READ_ALL_USERS, Role.READ_USERS, Role.WRITE_USERS),
    ),
  })
  roles: Role[];

  @Column
  @CreatedAt
  createdAt: Date;

  @Column
  @UpdatedAt
  updatedAt: Date;
}
