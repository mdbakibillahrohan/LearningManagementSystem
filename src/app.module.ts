import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';

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
    }),AuthModule,  UsersModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
