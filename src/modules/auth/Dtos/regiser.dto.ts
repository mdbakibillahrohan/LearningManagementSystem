
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString, IsDateString, MinLength } from 'class-validator';

export class RegisterDto {
  @ApiProperty({ example: 'John', description: 'First name of the user' })
  @IsNotEmpty()
  @IsString()
  first_name: string;

  @ApiProperty({ example: 'Doe', description: 'Last name of the user' })
  @IsOptional()
  @IsString()
  last_name?: string;

  @ApiProperty({ example: 'john.doe@example.com', description: 'Email address of the user' })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'john_doe', description: 'Unique username for login' })
  @IsNotEmpty()
  @IsString()
  username: string;

  @ApiProperty({ example: '01712345678', description: 'Phone number of the user' })
  @IsOptional()
  @IsString()
  phone_number?: string;

  @ApiProperty({ example: '1995-05-12', description: 'Date of birth (ISO format)' })
  @IsOptional()
  @IsDateString()
  date_of_birth?: string;

  @ApiProperty({ example: 'pass123', description: 'Password for the account (minimum 6 characters)' })
  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({ example: 1, description: 'Gender ID from the genders table' })
  @IsOptional()
  gender_id?: number;

  @ApiProperty({ example: 2, description: 'User type ID from the user_types table' })
  @IsOptional()
  user_type_id?: number;
}
