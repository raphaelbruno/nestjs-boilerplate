import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { IsArray, IsNotEmpty, IsNumber, Length } from 'class-validator';
import { Role } from 'src/domain/models/role';
import { PermissionResponse } from './permission.schema';

export class RoleCreate extends PartialType(Role) {
  @ApiProperty()
  @IsNotEmpty()
  @Length(3, 100)
  title: string;

  @ApiProperty()
  @IsNotEmpty()
  @Length(3, 100)
  key: string;

  @ApiProperty()
  @IsNumber()
  level: number;
}

export class RoleUpdate extends PartialType(RoleCreate) {
  @ApiPropertyOptional()
  @Length(3, 100)
  title?: string;

  @ApiProperty()
  @Length(3, 100)
  key: string;

  @ApiProperty()
  level: number;
}

export class RolePermissionsAsign extends PartialType(RoleCreate) {
  @ApiProperty()
  @IsNotEmpty()
  @IsArray()
  permissionsId: number[];
}

export class RoleResponse {
  @ApiProperty()
  @Expose()
  id: number;

  @ApiProperty()
  @Expose()
  title: string;

  @ApiProperty()
  @Expose()
  key: string;

  @ApiProperty()
  @Expose()
  level: number;

  @ApiProperty()
  @Expose()
  canManage: boolean;
}
export class RoleCompleteResponse extends RoleResponse {
  @ApiProperty()
  @Expose()
  @Type(() => PermissionResponse)
  permissions: PermissionResponse[];
}
