import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { UsersService } from './users/users.service';
import { config } from './config';
import { ConfigModule } from '@nestjs/config';
import { validationSchema } from './config/config.schema';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { MikroOrmConfig } from './config/mikro-orm.config';
import { CommonModule } from './common/common.module';

@Module({
  imports: [ConfigModule.forRoot({
      isGlobal: true,
      validationSchema,
      load: [config],
    }), 
    MikroOrmModule.forRootAsync({
      imports: [ConfigModule],
      useClass: MikroOrmConfig,
    }),
    AuthModule,  UsersModule, CommonModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
