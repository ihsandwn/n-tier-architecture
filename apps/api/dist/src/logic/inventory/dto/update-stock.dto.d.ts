export declare enum TransactionType {
    IN = "IN",
    OUT = "OUT",
    ADJUSTMENT = "ADJUSTMENT"
}
export declare class UpdateStockDto {
    productId: string;
    warehouseId: string;
    quantity: number;
    type: TransactionType;
    note?: string;
}
