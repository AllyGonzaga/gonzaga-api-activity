const mongoose = require('mongoose');
const chefSchema = new mongoose.Schema({
    name: String,
    speciality: String
});
module.exports = mongoose.model('Chef', chefSchema);