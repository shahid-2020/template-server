import {
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator'

export class UpdateUserDto {
  @IsString()
  @IsOptional()
  name?: string

  @IsString()
  @MinLength(8, {
    message: 'password is too short',
  })
  @MaxLength(30, {
    message: 'password is too long',
  })
  @IsOptional()
  password?: string
}
