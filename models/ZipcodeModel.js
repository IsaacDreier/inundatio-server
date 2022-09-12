const mongoose = require('mongoose');
const { Schema } = mongoose;

const ZipcodeSchema = new Schema({});

const Zipcode = new mongoose.model('Zipcode', ZipcodeSchema);

module.exports = Zipcode;
