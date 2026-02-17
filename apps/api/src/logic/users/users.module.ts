import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { RolesController } from './roles.controller';
import { PermissionsController } from './permissions.controller';
import { DataModule } from '../../data/data.module';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [DataModule, NotificationsModule],
  controllers: [UsersController, RolesController, PermissionsController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule { }
