import { IsNotEmpty, IsString, IsEnum } from 'class-validator';

export class CreateVehicleDto {
    @IsNotEmpty()
    @IsString()
    plateNumber: string;

    @IsNotEmpty()
    @IsString()
    type: string; // 'truck', 'van', 'bike'
}
