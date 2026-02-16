import { IsEmail, IsNotEmpty, MinLength, IsOptional, IsArray } from 'class-validator';

export class CreateUserDto {
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @MinLength(6)
    password: string;

    @IsOptional()
    @IsArray()
    roles?: string[];

    @IsOptional()
    tenantId?: string;
}

