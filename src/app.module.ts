import { Module } from '@nestjs/common';
import { UserModule } from './modules/user/user.module';
import { ToolModule } from './modules/tool/tool.module';
import { ProductAtributeModule } from './modules/product-atribute/product-atribute.module';
import { AtributeModule } from './modules/atribute/atribute.module';
import { ToolCategoryModule } from './modules/tool-category/tool-category.module';
import { MasterModule } from './modules/master/master.module';
import { MasterServiceModule } from './modules/master-service/master-service.module';
import { LevelModule } from './modules/level/level.module';
import { MasterCategoryModule } from './modules/master-category/master-category.module';
import { PrismaModule } from './config/prisma/prisma.module';
import { OrderModule } from './modules/order/order.module';
import { CommentModule } from './modules/comment/comment.module';
import { CartModule } from './modules/cart/cart.module';
import { CartItemModule } from './modules/cart-item/cart-item.module';
import { ToolItemModule } from './modules/tool-item/tool-item.module';
import { AuthModule } from './modules/auth/auth.module';
import { RegionModule } from './modules/region/region.module';

@Module({
  imports: [UserModule, ToolModule, ProductAtributeModule, AtributeModule, ToolCategoryModule, MasterModule, MasterServiceModule, LevelModule, MasterCategoryModule, PrismaModule, OrderModule, CommentModule, CartModule, CartItemModule, ToolItemModule, AuthModule, RegionModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
