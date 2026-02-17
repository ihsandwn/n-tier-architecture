import { NotificationsService } from '../logic/notifications/notifications.service';
export declare class NotificationsController {
    private readonly notificationsService;
    constructor(notificationsService: NotificationsService);
    findAll(req: any): Promise<any>;
    markAsRead(id: string): Promise<any>;
    markAllAsRead(req: any): Promise<any>;
}
