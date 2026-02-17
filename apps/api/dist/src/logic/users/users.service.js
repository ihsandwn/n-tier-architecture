"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../data/prisma/prisma.service");
const notifications_service_1 = require("../notifications/notifications.service");
const bcrypt = __importStar(require("bcrypt"));
let UsersService = class UsersService {
    prisma;
    notificationsService;
    constructor(prisma, notificationsService) {
        this.prisma = prisma;
        this.notificationsService = notificationsService;
    }
    async create(createUserDto) {
        const { roleIds, ...userData } = createUserDto;
        const existing = await this.findByEmail(userData.email);
        if (existing) {
            throw new common_1.ConflictException('Email already exists');
        }
        const hashedPassword = await bcrypt.hash(userData.password, 10);
        const user = await this.prisma.user.create({
            data: {
                ...userData,
                password: hashedPassword,
                roles: roleIds ? {
                    connect: roleIds.map(id => ({ id }))
                } : undefined,
            },
            select: {
                id: true,
                email: true,
                name: true,
                phone: true,
                roles: {
                    select: {
                        id: true,
                        name: true,
                        permissions: {
                            select: {
                                id: true,
                                name: true
                            }
                        }
                    }
                },
                createdAt: true,
            },
        });
        await this.notificationsService.notifyRole('admin', 'New User Registered', `${user.name || user.email} has just joined the platform.`, 'SUCCESS');
        return user;
    }
    async findByEmail(email) {
        return this.prisma.user.findUnique({
            where: { email },
            include: {
                roles: {
                    include: {
                        permissions: true
                    }
                }
            }
        });
    }
    findAll() {
        return this.prisma.user.findMany({
            select: {
                id: true,
                email: true,
                name: true,
                phone: true,
                roles: {
                    select: {
                        id: true,
                        name: true,
                    }
                },
                createdAt: true,
            },
        });
    }
    findOne(id) {
        return this.prisma.user.findUnique({
            where: { id },
            select: {
                id: true,
                email: true,
                name: true,
                phone: true,
                twoFactorEnabled: true,
                twoFactorSecret: true,
                roles: {
                    select: {
                        id: true,
                        name: true,
                        permissions: {
                            select: {
                                id: true,
                                name: true
                            }
                        }
                    }
                },
            },
        });
    }
    async update(id, updateUserDto) {
        const { roleIds, ...userData } = updateUserDto;
        if (userData.password) {
            userData.password = await bcrypt.hash(userData.password, 10);
        }
        if (roleIds) {
            const userToUpdate = await this.prisma.user.findUnique({
                where: { id },
                include: { roles: true }
            });
            const wasAdmin = userToUpdate?.roles.some((r) => r.name === 'admin');
            const newRoles = await this.prisma.role.findMany({
                where: { id: { in: roleIds } }
            });
            const isStillAdmin = newRoles.some((r) => r.name === 'admin');
            if (wasAdmin && !isStillAdmin) {
                const adminsCount = await this.prisma.user.count({
                    where: { roles: { some: { name: 'admin' } } }
                });
                if (adminsCount <= 1) {
                    throw new common_1.ConflictException('Security Rule: Cannot demote the last system administrator.');
                }
            }
        }
        return this.prisma.user.update({
            where: { id },
            data: {
                ...userData,
                roles: roleIds ? {
                    set: roleIds.map(id => ({ id })),
                } : undefined,
            },
            select: {
                id: true,
                email: true,
                name: true,
                phone: true,
                twoFactorEnabled: true,
                roles: {
                    select: {
                        id: true,
                        name: true,
                    }
                },
                updatedAt: true,
            },
        });
    }
    async enable2FA(userId, secret) {
        return this.prisma.user.update({
            where: { id: userId },
            data: {
                twoFactorSecret: secret,
                twoFactorEnabled: true,
            },
        });
    }
    async disable2FA(userId) {
        return this.prisma.user.update({
            where: { id: userId },
            data: {
                twoFactorSecret: null,
                twoFactorEnabled: false,
            },
        });
    }
    async remove(id) {
        const userToDelete = await this.prisma.user.findUnique({
            where: { id },
            include: { roles: true }
        });
        if (userToDelete?.roles.some((r) => r.name === 'admin')) {
            const adminsCount = await this.prisma.user.count({
                where: { roles: { some: { name: 'admin' } } }
            });
            if (adminsCount <= 1) {
                throw new common_1.ConflictException('Security Rule: Cannot delete the last system administrator.');
            }
        }
        return this.prisma.user.delete({
            where: { id },
            select: {
                id: true,
                email: true,
            },
        });
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        notifications_service_1.NotificationsService])
], UsersService);
//# sourceMappingURL=users.service.js.map