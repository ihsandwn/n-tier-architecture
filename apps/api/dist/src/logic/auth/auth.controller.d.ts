import { AuthService } from './auth.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    login(loginDto: LoginDto): Promise<{
        access_token: string;
        user: {
            id: any;
            email: any;
            roles: any;
            tenantId: any;
        };
    }>;
    register(createUserDto: CreateUserDto): Promise<{
        access_token: string;
        user: {
            id: any;
            email: any;
            roles: any;
            tenantId: any;
        };
    }>;
    googleAuth(req: any): Promise<void>;
    googleAuthRedirect(req: any): Promise<{
        access_token: string;
        user: {
            id: any;
            email: any;
            roles: any;
            tenantId: any;
        };
    }>;
}
