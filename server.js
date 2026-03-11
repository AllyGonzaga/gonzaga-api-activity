// server.js
require('dotenv').config();
const express = require('express');
const dns = require('node:dns');
dns.setServers(['1.1.1.1','8.8.8.8']);
const connectDB = require('./src/config/db');
const app = express();
connectDB();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Load Config
const PORT = process.env.PORT || 3000;
const BASE_URI = process.env.BASE_URI || '/api/v1';

// Import Routes
const authRoutes = require('./src/routes/authRoutes');   // <-- auth first
app.use(`${BASE_URI}/auth`, authRoutes);

const apiRoutes = require('./src/routes/apiRoutes');     
app.use(`${BASE_URI}/dishes`, apiRoutes);

const chefRoutes = require('./src/routes/chefRoutes');
app.use(`${BASE_URI}/chefs`, chefRoutes);

// Start Server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Base URI: http://localhost:${PORT}${BASE_URI}`);
    console.log(`API ready at: http://localhost:${PORT}${BASE_URI}/auth`);
    console.log(`API ready at: http://localhost:${PORT}${BASE_URI}/dishes`);
    console.log(`API ready at: http://localhost:${PORT}${BASE_URI}/chefs`);
});
