import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from '../../data/prisma/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';
export declare class UsersService {
    private readonly prisma;
    private readonly notificationsService;
    constructor(prisma: PrismaService, notificationsService: NotificationsService);
    create(createUserDto: CreateUserDto): Promise<any>;
    findByEmail(email: string): Promise<any>;
    findAll(): any;
    findOne(id: string): any;
    update(id: string, updateUserDto: UpdateUserDto): Promise<any>;
    enable2FA(userId: string, secret: string): Promise<any>;
    disable2FA(userId: string): Promise<any>;
    remove(id: string): Promise<any>;
}
