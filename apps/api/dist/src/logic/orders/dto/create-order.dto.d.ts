export declare class OrderItemDto {
    productId: string;
    quantity: number;
}
export declare class CreateOrderDto {
    customerName: string;
    items: OrderItemDto[];
}
