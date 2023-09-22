import {
  Controller,
  ForbiddenException,
  HttpStatus,
  Patch,
  UnauthorizedException,
} from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { EditUserDto } from './dto';

@Controller()
export class UserService {
  constructor(private prisma: PrismaService) {}
  getMe(user: User) {
    delete user.hash;
    return user;
  }

  @Patch('edit')
  async editUser(userId: User | any, dto: EditUserDto) {
    try {
      const userExists = await this.prisma.user.findUnique({
        where: {
          id: userId['id'],
        },
      });
      if (!userExists) {
        throw new UnauthorizedException('User does not exists.');
      } else {
        await this.prisma.user.update({
          data: {
            firstName: dto.firstName,
            lastName: dto.lastname,
            email: dto.email,
          },
          where: {
            id: userExists.id,
          },
        });
      }
    } catch (error) {
      throw new ForbiddenException();
    }
  }
}
