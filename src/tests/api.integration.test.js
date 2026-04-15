const request = require('supertest');
const app = require('../../server');
const dbHelper = require('./dbHelper');
const Dish = require('../models/dishModel');

jest.setTimeout(30000);

beforeAll(async () => await dbHelper.connect());
afterEach(async () => await dbHelper.clearDatabase());
afterAll(async () => await dbHelper.closeDatabase());

describe('Integration Test: Dish API', () => {

  // Helper to get admin token
  const getAdminToken = async () => {
    // Register an admin user first
    await request(app)
      .post('/api/v1/auth/register')
      .send({
        name: 'Admin User',
        email: 'admin@test.com',
        password: 'password123',
        role: 'admin'
      });

    // Login to get token
    const loginRes = await request(app)
      .post('/api/v1/auth/login')
      .send({
        email: 'admin@test.com',
        password: 'password123'
      });

    return loginRes.body.token; // adjust if your response uses different key
  };

  it('POST /api/v1/dishes - should physically save a dish to the database', async () => {
    const token = await getAdminToken();

    const newDish = {
      name: 'Integration Burger',
      price: 250,
      category: 'Main'
    };

    const response = await request(app)
      .post('/api/v1/dishes')
      .set('Authorization', `Bearer ${token}`)  // ✅ pass the token
      .send(newDish);

    expect(response.statusCode).toBe(201);
    expect(response.body.name).toBe('Integration Burger');

    const savedDish = await Dish.findOne({ name: 'Integration Burger' });
    expect(savedDish).toBeTruthy();
    expect(savedDish.price).toBe(250);
  });

  it('GET /api/v1/dishes - should return an empty array if DB is empty', async () => {
    const response = await request(app).get('/api/v1/dishes');

    expect(response.statusCode).toBe(200);
    expect(response.body.length).toBe(0);
  });

});