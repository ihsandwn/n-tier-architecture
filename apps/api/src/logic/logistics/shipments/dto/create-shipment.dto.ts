import { IsNotEmpty, IsUUID, IsString } from 'class-validator';

export class CreateShipmentDto {
    @IsNotEmpty()
    @IsUUID()
    orderId: string;

    @IsNotEmpty()
    @IsUUID()
    vehicleId: string;

    @IsNotEmpty()
    @IsUUID()
    driverId: string;

    @IsNotEmpty()
    @IsString()
    trackingNumber: string;
}
