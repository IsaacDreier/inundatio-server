const mongoose = require('mongoose');
const { Schema } = mongoose;

const DataSchema = new Schema({
  value: {
    type: Number,
    required: true,
  },
  timestamp: {
    type: Date,
    required: true,
  },
  site: {
    type: String,
    required: true,
  },
});

const Data = mongoose.model('Data', DataSchema);

module.exports = Data;
