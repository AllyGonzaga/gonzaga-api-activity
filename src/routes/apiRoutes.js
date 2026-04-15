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

// Dish routes — use '/' because server.js already mounts at /api/v1/dishes
router.get('/', getAllDishes);
router.post('/', protect, authorize('admin', 'manager'), createDish);
router.get('/:id', getDishById);
router.put('/:id', updateDish);
router.delete('/:id', deleteDish);

module.exports = router;