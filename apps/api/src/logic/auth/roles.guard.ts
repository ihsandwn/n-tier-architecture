import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from './role.enum';
import { ROLES_KEY } from './roles.decorator';
import { PERMISSIONS_KEY } from './permissions.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector) { }

    canActivate(context: ExecutionContext): boolean {
        // 1. Check for Roles
        const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);

        // 2. Check for Permissions
        const requiredPermissions = this.reflector.getAllAndOverride<string[]>(PERMISSIONS_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);

        if (!requiredRoles && !requiredPermissions) {
            return true;
        }

        const { user } = context.switchToHttp().getRequest();

        if (!user) {
            throw new ForbiddenException('User not found');
        }

        // --- Role Check ---
        if (requiredRoles) {
            const userRoles = user.roles || [];
            const hasRole = requiredRoles.some((role) => userRoles.includes(role));
            if (hasRole) return true;
        }

        // --- Permission Check ---
        if (requiredPermissions) {
            const userPermissions = user.permissions || [];
            const hasPermission = requiredPermissions.every((permission) =>
                userPermissions.includes(permission)
            );
            if (hasPermission) return true;
        }

        throw new ForbiddenException('Insufficient permissions');
    }
}
