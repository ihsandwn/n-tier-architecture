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
        // Flatten roles and permissions for the payload
        const roleNames = user.roles?.map((r: any) => r.name) || [];
        const permissions = user.roles?.flatMap((r: any) => r.permissions?.map((p: any) => p.name) || []) || [];

        // Remove duplicates from permissions
        const uniquePermissions = [...new Set(permissions)];

        const payload = {
            email: user.email,
            sub: user.id,
            roles: roleNames,
            permissions: uniquePermissions,
            tenantId: user.tenantId
        };

        return {
            access_token: this.jwtService.sign(payload),
            user: {
                id: user.id,
                email: user.email,
                roles: roleNames,
                permissions: uniquePermissions,
                tenantId: user.tenantId,
            }
        };
    }

    async register(createUserDto: CreateUserDto) {
        const user = await this.usersService.create(createUserDto);
        return this.login(user);
    }

    async googleLogin(user: any) {
        let existingUser: any = await this.usersService.findByEmail(user.email);
        if (!existingUser) {
            // In a real app, you'd find the default role by name first
            // For now, we'll assume there's a 'user' role but we need its ID.
            // This is a simplification; ideally UsersService.create handles defaults.
            existingUser = await this.usersService.create({
                email: user.email,
                password: Math.random().toString(36).slice(-8),
                roleIds: [], // Should be populated better in production
                tenantId: undefined // Let it be null or handle as needed
            });
        }
        return this.login(existingUser);
    }
}
