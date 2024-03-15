import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import {
  IsArray,
  IsEmail,
  IsNotEmpty,
  IsStrongPassword,
} from 'class-validator';
import { User } from 'src/domain/models/user';
import { RoleCompleteResponse } from './role.schema';

export class UserCreate extends PartialType(User) {
  @ApiProperty()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsStrongPassword()
  password: string;
}

export class UserUpdate extends PartialType(UserCreate) {
  @ApiPropertyOptional()
  @IsNotEmpty()
  @IsEmail()
  email?: string;
}

export class UserPasswordUpdate extends PartialType(UserCreate) {
  @ApiProperty()
  @IsNotEmpty()
  @IsStrongPassword()
  password: string;
}

export class UserRolesAsign extends PartialType(UserCreate) {
  @ApiProperty()
  @IsNotEmpty()
  @IsArray()
  rolesId: number[];
}

export class UserResponse {
  @ApiProperty()
  @Expose()
  id: number;

  @ApiProperty()
  @Expose()
  email: string;

  @ApiProperty()
  @Expose()
  canManage: boolean;
}

export class UserCompleteResponse extends UserResponse {
  @ApiProperty()
  @Expose()
  @Type(() => RoleCompleteResponse)
  roles: RoleCompleteResponse[];
}
