import { Module } from '@nestjs/common';
import { ToolModule } from './modules/tool/tool.module';
import { ToolCategoryModule } from './modules/tool-category/tool-category.module';
import { MasterModule } from './modules/master/master.module';
import { MasterServiceModule } from './modules/master-service/master-service.module';
import { LevelModule } from './modules/level/level.module';
import { MasterCategoryModule } from './modules/master-category/master-category.module';
import { PrismaModule } from './config/prisma/prisma.module';
import { OrderModule } from './modules/order/order.module';
import { CommentModule } from './modules/comment/comment.module';
import { CartModule } from './modules/cart/cart.module';
import { AuthModule } from './modules/auth/auth.module';
import { RegionModule } from './modules/region/region.module';
import { AttributeModule } from './modules/attribute/attribute.module';
import { ToolAttributeModule } from './modules/tool-attribute/tool-attribute.module';
import { UploadModule } from './modules/upload/upload.module';
import { SessionModule } from './modules/session/session.module';

@Module({
  imports: [ToolModule, ToolCategoryModule,AttributeModule, MasterModule, MasterServiceModule, LevelModule, MasterCategoryModule, PrismaModule, OrderModule, CommentModule, CartModule, AuthModule, RegionModule, ToolAttributeModule, UploadModule, SessionModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
