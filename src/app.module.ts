import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtGuard } from './modules/auth/guards/jwt-auth.guard';
import { JwtStrategy } from './modules/auth/strategy/jwt.strategy';

@Module({
  imports: [TypeOrmModule.forRoot({
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'postgres',
    password: 'postgres',
    database: 'lms',
    entities: [__dirname + '/**/*.entity{.ts,.js}'],
    synchronize: true,
  }), AuthModule, UsersModule],
  controllers: [AppController],
  providers: [AppService, {
    provide: APP_GUARD,
    useClass: JwtGuard
  },
    JwtStrategy
  ],
})
export class AppModule { }
