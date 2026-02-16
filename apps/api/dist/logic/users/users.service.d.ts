import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from '../../data/prisma/prisma.service';
export declare class UsersService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(createUserDto: CreateUserDto): Promise<{
        email: string;
        roles: string[];
        id: string;
        createdAt: Date;
    }>;
    findByEmail(email: string): Promise<{
        email: string;
        password: string;
        roles: string[];
        tenantId: string | null;
        id: string;
        refreshToken: string | null;
        createdAt: Date;
        updatedAt: Date;
    } | null>;
    findAll(): import("@prisma/client").Prisma.PrismaPromise<{
        email: string;
        roles: string[];
        id: string;
    }[]>;
    findOne(id: string): import("@prisma/client").Prisma.Prisma__UserClient<{
        email: string;
        roles: string[];
        id: string;
    } | null, null, import("@prisma/client/runtime/library").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    update(id: number, updateUserDto: UpdateUserDto): string;
    remove(id: number): string;
}
