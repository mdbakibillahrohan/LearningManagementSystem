
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString, IsDateString, MinLength } from 'class-validator';

export class SignInDto {
  @ApiProperty({ example: 'john_doe', description: 'Unique username for login' })
  @IsNotEmpty()
  @IsString()
  username: string;

  @ApiProperty({ example: 'pass123', description: 'Password for the account (minimum 6 characters)' })
  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  password: string;
}
