import { IsNotEmpty, IsString, IsArray, ValidateNested, IsInt, Min, IsUUID, IsOptional, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';

export class OrderItemDto {
    @IsNotEmpty()
    @IsUUID()
    productId: string;

    @IsNotEmpty()
    @IsInt()
    @Min(1)
    quantity: number;
}

export class CreateOrderDto {
    @IsNotEmpty()
    @IsString()
    customerName: string;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => OrderItemDto)
    items: OrderItemDto[];
}
