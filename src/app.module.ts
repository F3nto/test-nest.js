import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';

//! Modules
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({isGlobal: true, envFilePath: '.env'}),
    TypeOrmModule.forRoot({
      type : 'postgres',
      host : 'localhost',
      port : 5432,
      username : 'postgres',
      password : 'postgres',
      database : 'postgres',
      entities: [join(__dirname, '**', '*.entities.{ts,js}')],
      synchronize : true,
    }),
    AuthModule
  ],
 
})
export class AppModule {}
