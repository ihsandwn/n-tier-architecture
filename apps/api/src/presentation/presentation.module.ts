import { Module } from '@nestjs/common';
import { LogicModule } from '../logic/logic.module';
import { NotificationsController } from './notifications.controller';

@Module({
    imports: [LogicModule],
    controllers: [NotificationsController],
    providers: [],
})
export class PresentationModule { }
