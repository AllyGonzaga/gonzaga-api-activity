const express = require('express');
const router = express.Router();

// Import the controller
const {
    getAllChefs,
    createChef,
    getChefById,
    updateChef,
    deleteChef,
} = require('../controllers/chefController');

// 1. GET /chefs → get all chefs
router.get('/chefs', getAllChefs);

// 2. POST /chefs → create chef
router.post('/chefs', createChef);

// 3. GET /chefs/:id → get specific chef
router.get('/chefs/:id', getChefById);

// 4. PUT /chefs/:id → update chef
router.put('/chefs/:id', updateChef);

// 5. DELETE /chefs/:id → delete chef
router.delete('/chefs/:id', deleteChef);

// Export router
module.exports = router;
