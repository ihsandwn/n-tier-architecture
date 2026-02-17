import { IsEmail, IsNotEmpty, MinLength, IsOptional, IsArray, IsString } from 'class-validator';

export class CreateUserDto {
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @MinLength(6)
    password: string;

    @IsOptional()
    @IsString()
    name?: string;

    @IsOptional()
    @IsString()
    phone?: string;

    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    roleIds?: string[];

    @IsOptional()
    tenantId?: string;
}

