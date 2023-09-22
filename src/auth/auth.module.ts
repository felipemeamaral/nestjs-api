import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategy';

@Module({
  controllers: [AuthController],
  imports: [JwtModule.register({})],
  providers: [AuthService, JwtStrategy],
})
export class AuthModule {}
