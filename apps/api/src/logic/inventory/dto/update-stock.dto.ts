import { IsNotEmpty, IsUUID, IsInt, Min } from 'class-validator';

export class UpdateStockDto {
    @IsNotEmpty()
    @IsUUID()
    productId: string;

    @IsNotEmpty()
    @IsUUID()
    warehouseId: string;

    @IsNotEmpty()
    @IsInt()
    @Min(0)
    quantity: number;
}
