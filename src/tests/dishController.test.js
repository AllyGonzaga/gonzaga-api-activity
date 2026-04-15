// src/tests/dishController.test.js

const { getAllDishes, createDish, getDishById, updateDish, deleteDish } = require('../controllers/dishController');
const Dish = require('../models/dishModel');
const httpMocks = require('node-mocks-http');

jest.mock('../models/dishModel');

describe('Dish Controller Unit Tests', () => {

  let req, res;

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
  });

  // ==========================================
  // GET ALL DISHES
  // ==========================================
  describe('GET /dishes (getAllDishes)', () => {

    it('should return 200 OK and a list of dishes', async () => {
      // 1. Arrange
      const fakeData = [{ name: 'Adobo', price: 150 }, { name: 'Sinigang', price: 200 }];
      Dish.find.mockResolvedValue(fakeData);

      // 2. Act
      await getAllDishes(req, res);

      // 3. Assert
      expect(res.statusCode).toBe(200);
      expect(res._getJSONData()).toStrictEqual(fakeData);
      expect(Dish.find).toHaveBeenCalledTimes(1);
    });

    it('should return 500 if database crashes', async () => {
      // 1. Arrange
      Dish.find.mockRejectedValue(new Error('DB Connection Lost'));

      // 2. Act
      await getAllDishes(req, res);

      // 3. Assert
      expect(res.statusCode).toBe(500);
      expect(res._getJSONData()).toStrictEqual({ message: 'DB Connection Lost' });
    });

  });

  // ==========================================
  // CREATE DISH
  // ==========================================
  describe('POST /dishes (createDish)', () => {

    it('should return 201 Created and the new dish', async () => {
      // 1. Arrange
      req.body = { name: 'Pancit', price: 100 };
      const fakeSavedDish = { _id: '12345', name: 'Pancit', price: 100 };
      Dish.create.mockResolvedValue(fakeSavedDish);

      // 2. Act
      await createDish(req, res);

      // 3. Assert
      expect(res.statusCode).toBe(201);
      expect(res._getJSONData()).toStrictEqual(fakeSavedDish);
      expect(Dish.create).toHaveBeenCalledWith(req.body);
    });

    it('should return 400 if create fails', async () => {
      // 1. Arrange
      req.body = { name: 'Pancit', price: 100 };
      Dish.create.mockRejectedValue(new Error('Validation failed'));

      // 2. Act
      await createDish(req, res);

      // 3. Assert
      expect(res.statusCode).toBe(400);
      expect(res._getJSONData()).toStrictEqual({ message: 'Validation failed' });
    });

  });

  // ==========================================
  // GET DISH BY ID
  // ==========================================
  describe('GET /dishes/:id (getDishById)', () => {

    it('should return 200 and the dish if found', async () => {
      // 1. Arrange
      const fakeDish = { _id: '12345', name: 'Adobo', price: 150 };
      req.params = { id: '12345' };
      Dish.findById.mockResolvedValue(fakeDish);

      // 2. Act
      await getDishById(req, res);

      // 3. Assert
      expect(res.statusCode).toBe(200);
      expect(res._getJSONData()).toStrictEqual(fakeDish);
      expect(Dish.findById).toHaveBeenCalledWith('12345');
    });

    it('should return 404 if dish does not exist', async () => {
      // 1. Arrange
      req.params = { id: 'nonexistent' };
      Dish.findById.mockResolvedValue(null);

      // 2. Act
      await getDishById(req, res);

      // 3. Assert
      expect(res.statusCode).toBe(404);
      expect(res._getJSONData()).toStrictEqual({ message: 'Dish not found' });
    });

    it('should return 500 if database crashes', async () => {
      // 1. Arrange
      req.params = { id: '12345' };
      Dish.findById.mockRejectedValue(new Error('DB Connection Lost'));

      // 2. Act
      await getDishById(req, res);

      // 3. Assert
      expect(res.statusCode).toBe(500);
      expect(res._getJSONData()).toStrictEqual({ message: 'DB Connection Lost' });
    });

  });

  // ==========================================
  // UPDATE DISH
  // ==========================================
  describe('PUT /dishes/:id (updateDish)', () => {

    it('should return 200 and the updated dish', async () => {
      // 1. Arrange
      req.params = { id: '12345' };
      req.body = { name: 'Adobo Updated', price: 200 };
      const fakeUpdated = { _id: '12345', name: 'Adobo Updated', price: 200 };
      Dish.findByIdAndUpdate.mockResolvedValue(fakeUpdated);

      // 2. Act
      await updateDish(req, res);

      // 3. Assert
      expect(res.statusCode).toBe(200);
      expect(res._getJSONData()).toStrictEqual(fakeUpdated);
      expect(Dish.findByIdAndUpdate).toHaveBeenCalledWith('12345', req.body, { new: true });
    });

    it('should return 404 if dish does not exist', async () => {
      // 1. Arrange
      req.params = { id: 'nonexistent' };
      req.body = { name: 'Ghost Dish' };
      Dish.findByIdAndUpdate.mockResolvedValue(null);

      // 2. Act
      await updateDish(req, res);

      // 3. Assert
      expect(res.statusCode).toBe(404);
      expect(res._getJSONData()).toStrictEqual({ message: 'Dish not found' });
    });

    it('should return 400 if update fails', async () => {
      // 1. Arrange
      req.params = { id: '12345' };
      req.body = { name: 'Bad Dish' };
      Dish.findByIdAndUpdate.mockRejectedValue(new Error('Validation failed'));

      // 2. Act
      await updateDish(req, res);

      // 3. Assert
      expect(res.statusCode).toBe(400);
      expect(res._getJSONData()).toStrictEqual({ message: 'Validation failed' });
    });

  });

  // ==========================================
  // DELETE DISH
  // ==========================================
  describe('DELETE /dishes/:id (deleteDish)', () => {

    it('should return 200 and success message', async () => {
      // 1. Arrange
      req.params = { id: '12345' };
      Dish.findByIdAndDelete.mockResolvedValue({ _id: '12345' });

      // 2. Act
      await deleteDish(req, res);

      // 3. Assert
      expect(res.statusCode).toBe(200);
      expect(res._getJSONData()).toStrictEqual({ message: 'Dish deleted successfully' });
      expect(Dish.findByIdAndDelete).toHaveBeenCalledWith('12345');
    });

    it('should return 404 if dish does not exist', async () => {
      // 1. Arrange
      req.params = { id: 'nonexistent' };
      Dish.findByIdAndDelete.mockResolvedValue(null);

      // 2. Act
      await deleteDish(req, res);

      // 3. Assert
      expect(res.statusCode).toBe(404);
      expect(res._getJSONData()).toStrictEqual({ message: 'Dish not found' });
    });

    it('should return 500 if database crashes', async () => {
      // 1. Arrange
      req.params = { id: '12345' };
      Dish.findByIdAndDelete.mockRejectedValue(new Error('DB Connection Lost'));

      // 2. Act
      await deleteDish(req, res);

      // 3. Assert
      expect(res.statusCode).toBe(500);
      expect(res._getJSONData()).toStrictEqual({ message: 'DB Connection Lost' });
    });

  });

});