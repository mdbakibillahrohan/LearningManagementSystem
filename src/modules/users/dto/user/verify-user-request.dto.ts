import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class VerifyUserRequest{
    @ApiProperty({ example: 'john_doe', description: 'Unique username for login' })
    @IsNotEmpty()
    @IsString()
    username: string;

    @ApiProperty({ example: '985845', description: 'otp sent to mail' })
    @IsNotEmpty()
    @IsString()
    otp: string;
}