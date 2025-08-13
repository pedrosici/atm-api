import { Module } from '@nestjs/common';
import { AccountController } from './infrastructure/controllers/account.controller';
import { CardController } from './infrastructure/controllers/card.controller';

@Module({
  imports: [],
  controllers: [AccountController, CardController],
  providers: [],
})
export class AppModule {}
