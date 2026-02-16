import { IsNotEmpty, IsString, IsInt, IsOptional, IsUUID, Min } from 'class-validator';

export class CreateWarehouseDto {
    @IsNotEmpty()
    @IsString()
    name: string;

    @IsNotEmpty()
    @IsString()
    location: string;

    @IsOptional()
    @IsInt()
    @Min(0)
    capacity?: number;

    @IsNotEmpty()
    @IsUUID()
    tenantId: string;
}
