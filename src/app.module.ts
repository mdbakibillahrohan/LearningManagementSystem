import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtGuard } from './modules/auth/guards/jwt-auth.guard';
import { JwtStrategy } from './modules/auth/strategy/jwt.strategy';
import { MailerModule } from '@nestjs-modules/mailer';
import { MailModule } from './modules/mail/mail.module';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    // Load .env globally
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    // TypeORM with async config + SSL only in production
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        const isProd = configService.get<string>('NODE_ENV') === 'production';

        return {
          type: 'postgres' as const,
          host: configService.get<string>('DB_HOST'),
          port: configService.get<number>('DB_PORT'),
          username: configService.get<string>('DB_USERNAME'),
          password: configService.get<string>('DB_PASSWORD'),
          database: configService.get<string>('DB_DATABASE'),
          entities: [__dirname + '/**/*.entity{.ts,.js}'],
          synchronize: !isProd, // Auto-sync only in development
          logging: !isProd,
          ...(isProd && {
            ssl: true,
            extra: {
              ssl: {
                rejectUnauthorized: true,
              },
            },
          }),
        };
      },
      inject: [ConfigService],
    }),

    // Mailer with async config + secure TLS in production
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        const isProd = configService.get<string>('NODE_ENV') === 'production';

        return {
          transport: {
            host: configService.get<string>('EMAIL_HOST'),
            port: configService.get<number>('EMAIL_PORT'),
            secure: configService.get<boolean>('EMAIL_SECURE'), // false for 587, true for 465
            auth: {
              user: configService.get<string>('EMAIL_USER'),
              pass: configService.get<string>('EMAIL_PASS'),
            },
            tls: {
              rejectUnauthorized: isProd, // true in prod, false in dev
            },
          },
          defaults: {
            from: configService.get<string>('EMAIL_FROM'),
          },
        };
      },
      inject: [ConfigService],
    }),

    // Your feature modules
    AuthModule,
    UsersModule,
    MailModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtGuard,
    },
    JwtStrategy,
  ],
})
export class AppModule {
  constructor(private configService: ConfigService) {
    const env = this.configService.get<string>('NODE_ENV');
    const emailHost = this.configService.get<string>('EMAIL_HOST');
    console.log(`[AppModule] Running in: ${env}`);
    console.log(`[AppModule] Email Host: ${emailHost}`);
    if (env === 'production') {
      console.log('[AppModule] SSL/TLS enabled for DB and Email');
    }
  }
}