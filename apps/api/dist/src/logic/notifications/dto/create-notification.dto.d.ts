export declare enum NotificationType {
    INFO = "INFO",
    WARNING = "WARNING",
    SUCCESS = "SUCCESS",
    ERROR = "ERROR"
}
export declare class CreateNotificationDto {
    userId: string;
    type: string;
    title: string;
    message: string;
    link?: string;
}
