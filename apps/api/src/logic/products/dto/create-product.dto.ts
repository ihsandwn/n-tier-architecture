import { IsNotEmpty, IsString, IsOptional, IsUUID } from 'class-validator';

export class CreateProductDto {
    @IsNotEmpty()
    @IsString()
    sku: string;

    @IsNotEmpty()
    @IsString()
    name: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsNotEmpty()
    @IsUUID()
    tenantId: string;
}
