import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { IsNotEmpty, Length } from 'class-validator';
import { Sample } from 'src/domain/models/sample';
import { UserResponse } from './user.schema';

export class SampleCreate extends PartialType(Sample) {
  @ApiProperty()
  @IsNotEmpty()
  @Length(3, 100)
  title: string;

  @ApiProperty()
  @IsNotEmpty()
  userId: number;
}

export class SampleUpdate extends PartialType(SampleCreate) {
  @ApiPropertyOptional()
  @IsNotEmpty()
  @Length(3, 100)
  title?: string;
}

export class SampleResponse {
  @ApiProperty()
  @Expose()
  id: number;

  @ApiProperty()
  @Expose()
  title: string;
}

export class SampleCompleteResponse extends SampleResponse {
  @ApiProperty()
  @Expose()
  @Type(() => UserResponse)
  user: UserResponse;
}
