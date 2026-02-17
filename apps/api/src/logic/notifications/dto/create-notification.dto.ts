import { IsString, IsNotEmpty, IsEnum, IsOptional, IsUUID } from 'class-validator';

export enum NotificationType {
    INFO = 'INFO',
    WARNING = 'WARNING',
    SUCCESS = 'SUCCESS',
    ERROR = 'ERROR',
}

export class CreateNotificationDto {
    @IsUUID()
    @IsNotEmpty()
    userId: string;

    @IsEnum(NotificationType)
    @IsNotEmpty()
    type: string;

    @IsString()
    @IsNotEmpty()
    title: string;

    @IsString()
    @IsNotEmpty()
    message: string;

    @IsString()
    @IsOptional()
    link?: string;
}
