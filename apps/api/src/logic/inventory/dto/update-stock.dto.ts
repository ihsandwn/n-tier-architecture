import { IsNotEmpty, IsUUID, IsInt, Min, IsEnum, IsOptional, IsString } from 'class-validator';

export enum TransactionType {
    IN = 'IN',
    OUT = 'OUT',
    ADJUSTMENT = 'ADJUSTMENT'
}

export class UpdateStockDto {
    @IsNotEmpty()
    @IsUUID()
    productId: string;

    @IsNotEmpty()
    @IsUUID()
    warehouseId: string;

    @IsNotEmpty()
    @IsInt()
    @Min(1)
    quantity: number;

    @IsNotEmpty()
    @IsEnum(TransactionType)
    type: TransactionType;

    @IsOptional()
    @IsString()
    note?: string;
}
