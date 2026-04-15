// tests/authMiddleware.test.js
const { protect } = require('../middleware/authMiddleware');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const httpMocks = require('node-mocks-http');

jest.mock('jsonwebtoken');
jest.mock('../models/userModel');

describe('Auth Middleware - protect', () => {

  let req, res, next;

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
  });

  it('should call next() if token is valid', async () => {
    // Arrange
    req.headers.authorization = 'Bearer valid_fake_token';
    jwt.verify.mockReturnValue({ id: 'user123' });

    // ✅ Matches your: User.findById(decoded.id).select('-password')
    User.findById.mockReturnValue({
      select: jest.fn().mockResolvedValue({ _id: 'user123', name: 'John' })
    });

    // Act
    await protect(req, res, next);

    // Assert
    expect(jwt.verify).toHaveBeenCalled();
    expect(next).toHaveBeenCalledTimes(1);
  });

  it('should return 401 if no token is provided', async () => {
    // Arrange: req.headers is empty by default

    // Act
    await protect(req, res, next);

    // Assert
    expect(res.statusCode).toBe(401);
    // ✅ Matches your exact message when no token
    expect(res._getJSONData()).toStrictEqual({ message: 'Not authorized, no token' });
    expect(next).not.toHaveBeenCalled();
  });

  // ✅ BONUS: test the token failed scenario (your catch block)
  it('should return 401 if token is invalid', async () => {
    // Arrange
    req.headers.authorization = 'Bearer bad_token';
    jwt.verify.mockImplementation(() => { throw new Error('Invalid token'); });

    // Act
    await protect(req, res, next);

    // Assert
    expect(res.statusCode).toBe(401);
    // ✅ Matches your catch block message
    expect(res._getJSONData()).toStrictEqual({ message: 'Not authorized, token failed' });
    expect(next).not.toHaveBeenCalled();
  });

});