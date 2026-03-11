const express = require('express');
const router = express.Router();

const {
    getAllDishes,
    createDish,
    getDishById,
    updateDish,
    deleteDish,
} = require('../controllers/dishController');

const { protect, authorize } = require('../middleware/authMiddleware');

const { registerUser, loginUser } = require('../controllers/authController');

// Auth routes
router.post('/register', registerUser);
router.post('/login', loginUser);

// Dish routes
router.get('/dishes', getAllDishes);
router.post('/dishes', protect, authorize('admin', 'manager'), createDish);
router.get('/dishes/:id', getDishById);
router.put('/dishes/:id', updateDish);
router.delete('/dishes/:id', deleteDish);

module.exports = router;
