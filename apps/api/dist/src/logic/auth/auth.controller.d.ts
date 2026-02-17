import { AuthService } from './auth.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { TwoFactorService } from './two-factor.service';
import { UsersService } from '../users/users.service';
export declare class AuthController {
    private authService;
    private twoFactorService;
    private usersService;
    constructor(authService: AuthService, twoFactorService: TwoFactorService, usersService: UsersService);
    getProfile(req: any): Promise<any>;
    login(req: any): Promise<{
        access_token: string;
        user: {
            id: any;
            email: any;
            roles: any;
            permissions: unknown[];
            tenantId: any;
        };
    } | {
        requiresTwoFactor: boolean;
        userId: any;
    }>;
    register(createUserDto: CreateUserDto): Promise<{
        access_token: string;
        user: {
            id: any;
            email: any;
            roles: any;
            permissions: unknown[];
            tenantId: any;
        };
    }>;
    generate2FA(req: any): Promise<{
        secret: any;
        qrCodeDataUrl: string;
    }>;
    enable2FA(req: any, body: {
        secret: string;
        code: string;
    }): Promise<{
        message: string;
    }>;
    disable2FA(req: any): Promise<{
        message: string;
    }>;
    googleAuth(req: any): Promise<void>;
    googleAuthRedirect(req: any): Promise<{
        access_token: string;
        user: {
            id: any;
            email: any;
            roles: any;
            permissions: unknown[];
            tenantId: any;
        };
    }>;
}
