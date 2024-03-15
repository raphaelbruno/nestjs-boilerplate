import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsNotEmpty, Length } from 'class-validator';
import { Permission } from 'src/domain/models/permission';

export class PermissionCreate extends PartialType(Permission) {
  @ApiProperty()
  @IsNotEmpty()
  @Length(3, 100)
  title: string;

  @ApiProperty()
  @IsNotEmpty()
  @Length(3, 100)
  key: string;
}

export class PermissionUpdate extends PartialType(PermissionCreate) {
  @ApiPropertyOptional()
  @Length(3, 100)
  title?: string;

  @ApiProperty()
  @Length(3, 100)
  key: string;
}

export class PermissionResponse {
  @ApiProperty()
  @Expose()
  id: number;

  @ApiProperty()
  @Expose()
  title: string;

  @ApiProperty()
  @Expose()
  key: string;
}
