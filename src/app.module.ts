import { Module } from '@nestjs/common';
import { AccountController } from './infrastructure/controllers/account.controller';


@Module({
  imports: [],
  controllers: [AccountController],
  providers: [],
})
export class AppModule {}
