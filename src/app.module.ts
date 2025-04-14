import { Module } from '@nestjs/common';
import { UserModule } from './modules/user/user.module';
import { ToolModule } from './modules/tool/tool.module';
import { ProductAtributeModule } from './modules/product-atribute/product-atribute.module';
import { AtributeModule } from './modules/atribute/atribute.module';
import { ToolCategoryModule } from './modules/tool-category/tool-category.module';
import { MasterModule } from './modules/master/master.module';
import { MasterServiceModule } from './modules/master-service/master-service.module';
import { LevelItemModule } from './modules/level-item/level-item.module';
import { LevelModule } from './modules/level/level.module';
import { MasterCategoryModule } from './modules/master-category/master-category.module';
import { PrismaModule } from './config/prisma/prisma.module';
import { OrderModule } from './module/order/order.module';
import { OrderModule } from './modules/order/order.module';
import { CommentModule } from './modules/comment/comment.module';
import { CartModule } from './modules/cart/cart.module';
import { CartitemModule } from './modules/cartitem/cartitem.module';
import { CartItemModule } from './modules/cart-item/cart-item.module';
import { ToolItemModule } from './modules/tool-item/tool-item.module';
import { EskizService } from './config/eskiz/eskiz.service';

@Module({
  imports: [UserModule, ToolModule, ProductAtributeModule, AtributeModule, ToolCategoryModule, MasterModule, MasterServiceModule, LevelItemModule, LevelModule, MasterCategoryModule, PrismaModule, OrderModule, CommentModule, CartModule, CartitemModule, CartItemModule, ToolItemModule],
  controllers: [],
  providers: [EskizService],
})
export class AppModule {}
