import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
    constructor(configService: ConfigService) {
        super({
            datasources: {
                db: {
                    url: configService.get<string>('DATABASE_URL'),
                },
            },
        });
    }

    async onModuleInit() {
        console.log('PrismaService: Connecting...');
        try {
            await this.$connect();
            console.log('PrismaService: Connected!');
        } catch (e) {
            console.error('PrismaService: Connection failed', e);
        }
    }

    async onModuleDestroy() {
        await this.$disconnect();
    }
}
