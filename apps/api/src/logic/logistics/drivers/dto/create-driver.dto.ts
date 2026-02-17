import { IsNotEmpty, IsString } from 'class-validator';

export class CreateDriverDto {
    @IsNotEmpty()
    @IsString()
    name: string;

    @IsNotEmpty()
    @IsString()
    license: string;
}
