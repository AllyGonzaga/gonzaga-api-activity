const dns = require('node:dns').promises;
dns.setServers(['1.1.1.1', '8.8.8.8']);
const mongoose = require('mongoose');

const connectDB = async () => {
    try{
        //This tries to connect usig the key in your .env file
        const conn = await mongoose.connect(process.env.MONGO_URI);

        //If successful, it prints the host name
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    
    } catch (error) {
        //If it fails, it shows the error and stops the server
        console.error(`Error: ${error.message}`);
    }

};

module.exports = connectDB;