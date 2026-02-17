import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from '../users/dto/create-user.dto';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
    ) { }

    async validateUser(email: string, pass: string): Promise<any> {
        const user = await this.usersService.findByEmail(email);
        if (user && (await bcrypt.compare(pass, user.password))) {
            const { password, ...result } = user;
            return result;
        }
        return null;
    }

    async login(user: any) {
        const payload = { email: user.email, sub: user.id, roles: user.roles, tenantId: user.tenantId };
        return {
            access_token: this.jwtService.sign(payload),
            user: {
                id: user.id,
                email: user.email,
                roles: user.roles,
                tenantId: user.tenantId,
            }
        };
    }

    async register(createUserDto: CreateUserDto) {
        const user = await this.usersService.create(createUserDto);
        return this.login(user); // Fixed typo from 'user' to 'user' if meaningful, but likely just appending
    }

    async googleLogin(user: any) {
        let existingUser: any = await this.usersService.findByEmail(user.email);
        if (!existingUser) {
            // Auto-register via Google
            // Note: In real app, might want to confirm tenant or role
            existingUser = await this.usersService.create({
                email: user.email,
                password: Math.random().toString(36).slice(-8), // Dummy password
                roles: ['user'],
                tenantId: 'default-tenant'
            });
        }
        return this.login(existingUser);
    }
}
