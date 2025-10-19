import { LoadStrategy, Options } from '@mikro-orm/core';
import { MikroOrmModuleOptions, MikroOrmOptionsFactory } from '@mikro-orm/nestjs';
import { defineConfig } from '@mikro-orm/postgresql';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

const config: Options = defineConfig({
  clientUrl: process.env.DATABASE_URL,
  entities: ['dist/**/*.entity.js', 'dist/**/*.embeddable.js'],
  entitiesTs: ['src/**/*.entity.ts', 'src/**/*.embeddable.ts'],
  loadStrategy: LoadStrategy.JOINED,
  allowGlobalContext: true,
});


@Injectable()
export class MikroOrmConfig implements MikroOrmOptionsFactory {
  constructor(private readonly configService: ConfigService) {}

  public createMikroOrmOptions(): MikroOrmModuleOptions {
    return this.configService.get<MikroOrmModuleOptions>('db')!;
  }
}

export default config;

