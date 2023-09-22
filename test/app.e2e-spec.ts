import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as pactum from 'pactum';
import { AppModule } from '../src/app.module';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDto } from 'src/auth/dto';

describe('App e2e', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = moduleRef.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
      }),
    );
    await app.init();

    await app.listen(3333);

    prisma = app.get(PrismaService);
    await prisma.cleanDb();
    pactum.request.setBaseUrl('http://localhost:3333');
  });
  afterAll(() => {
    app.close();
  });
  describe('Auth', () => {
    describe('Signup', () => {
      it('Should Signup', () => {
        const dto: AuthDto = {
          email: 'felipe@gmail.com',
          password: '123',
        };
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody(dto)
          .expectStatus(201);
      });
    });

    describe('Login', () => {
      it('Should Login', () => {
        const dto: AuthDto = {
          email: 'felipe@gmail.com',
          password: '123',
        };
        return pactum
          .spec()
          .post('/auth/login')
          .withBody(dto)
          .expectStatus(200)
          .stores('ACCESS_TOKEN', 'access_token');
      });
    });
  });
  describe('User', () => {
    describe('Get Me', () => {
      it('Should Get Me', () => {
        return pactum
          .spec()
          .get('/users/me')
          .withHeaders({
            Authorization: 'Bearer $S{ACCESS_TOKEN}',
          })
          .expectStatus(200);
      });
    });
    describe('Edit User', () => {
      it('Should Edit User', () => {
        return pactum
          .spec()
          .patch('/users/edit')
          .withHeaders({
            Authorization: 'Bearer $S{ACCESS_TOKEN}',
          })
          .withJson({
            email: 'aline@gmail.com',
            firstName: 'Aline',
            lastname: 'Pereira',
          })
          .expectStatus(201)
          .inspect();
      });
    });
  });
});
