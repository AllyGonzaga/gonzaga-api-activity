const express = require('express');
const router = express.Router();

// Import the controller
const {
    getAllDishes,
    createDish,
    getDishById,
    updateDish,
    deleteDish,
} = require('../controllers/dishController');

// 1. If user goes to GET /dishes → get all dishes
router.get('/dishes', getAllDishes);

// 2. If user sends POST /dishes → create dish
router.post('/dishes', createDish);

// 3. If user goes to GET /dishes/:id → get specific dish
router.get('/dishes/:id', getDishById);

// 4. If user sends PUT /dishes/:id → update dish
router.put('/dishes/:id', updateDish);

// 5. If user sends DELETE /dishes/:id → delete dish
router.delete('/dishes/:id', deleteDish);

// Export router (ONLY ONCE, AT THE END)
module.exports = router;