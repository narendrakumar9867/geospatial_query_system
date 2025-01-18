import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../src/app.module';
import * as request from 'supertest';

describe('CitiesController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  const cityPayload = {
    name: 'Test City',
    boundary: {
      type: 'Polygon',
      coordinates: [[[0, 0], [0, 10], [10, 10], [10, 0], [0, 0]]],
    },
  };

  it('/cities (POST) - Create a city', async () => {
    const response = await request(app.getHttpServer())
      .post('/cities')
      .send(cityPayload)
      .expect(201);

    expect(response.body.name).toBe(cityPayload.name);
    expect(response.body.boundary).toEqual(cityPayload.boundary);
  });

  it('/cities/:id (GET) - Find cities by ID', async () => {
    const createResponse = await request(app.getHttpServer())
      .post('/cities')
      .send(cityPayload);

    const cityId = createResponse.body._id;

    const response = await request(app.getHttpServer())
      .get(`/cities/${cityId}`)
      .expect(200);

    expect(response.body.name).toBe(cityPayload.name);
    expect(response.body.boundary).toEqual(cityPayload.boundary);
  });

  it('/cities/:id (PATCH) - Update a city boundary', async () => {
    const createResponse = await request(app.getHttpServer())
      .post('/cities')
      .send(cityPayload);

    const cityId = createResponse.body._id;
    const updatedBoundary = {
      type: 'Polygon',
      coordinates: [[[1, 1], [1, 11], [11, 11], [11, 1], [1, 1]]],
    };

    const response = await request(app.getHttpServer())
      .patch(`/cities/${cityId}`)
      .send({ boundary: updatedBoundary })
      .expect(200);

    expect(response.body.boundary).toEqual(updatedBoundary);
  });

  it('/cities/:id (DELETE) - Delete a city', async () => {
    const createResponse = await request(app.getHttpServer())
      .post('/cities')
      .send(cityPayload);

    const cityId = createResponse.body._id;

    await request(app.getHttpServer())
      .delete(`/cities/${cityId}`)
      .expect(200);
  });
});
