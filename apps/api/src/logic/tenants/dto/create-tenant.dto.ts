import { IsNotEmpty, IsString, IsEnum, IsOptional } from 'class-validator';

export class CreateTenantDto {
    @IsNotEmpty()
    @IsString()
    name: string;

    @IsOptional()
    @IsString()
    @IsEnum(['free', 'pro', 'enterprise'])
    plan?: string;
}
