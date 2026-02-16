import { Module } from '@nestjs/common';
import { LogicModule } from '../logic/logic.module';

@Module({
    imports: [LogicModule],
    controllers: [],
    providers: [],
})
export class PresentationModule { }
