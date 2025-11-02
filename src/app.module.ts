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
    // Load environment variables dynamically
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: process.env.NODE_ENV === 'production' ? '.env.production' : '.env',
    }),

    // TypeORM Config
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        const isProd = configService.get<string>('NODE_ENV') === 'production';

        return {
          type: 'postgres' as const,
          host: configService.get<string>('DB_HOST'),
          port: Number(configService.get<number>('DB_PORT')),
          username: configService.get<string>('DB_USERNAME'),
          password: configService.get<string>('DB_PASSWORD'),
          database: configService.get<string>('DB_DATABASE'),
          entities: [__dirname + '/**/*.entity{.ts,.js}'],
          synchronize: true,
          logging: false,
          ...(isProd && {
            ssl: {
              rejectUnauthorized: false, // often needed for Neon / Railway
            },
          }),
        };
      },
      inject: [ConfigService],
    }),

    // Mailer Config
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        const isProd = configService.get<string>('NODE_ENV') === 'production';

        return {
          transport: {
            host: configService.get<string>('EMAIL_HOST'),
            port: Number(configService.get<number>('EMAIL_PORT')),
            secure: configService.get<boolean>('EMAIL_SECURE'),
            auth: {
              user: configService.get<string>('EMAIL_USER'),
              pass: configService.get<string>('EMAIL_PASS'),
            },
            tls: {
              rejectUnauthorized: isProd,
            },
          },
          defaults: {
            from: configService.get<string>('EMAIL_FROM'),
          },
        };
      },
      inject: [ConfigService],
    }),

    // Feature Modules
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
    const dbHost = this.configService.get<string>('DB_HOST');
    console.log(`[AppModule] Running in: ${env}`);
    console.log(`[AppModule] Using DB Host: ${dbHost}`);
    if (env === 'production') {
      console.log('[AppModule] Using .env.production file (SSL enabled)');
    } else {
      console.log('[AppModule] Using .env file (local)');
    }
  }
}
