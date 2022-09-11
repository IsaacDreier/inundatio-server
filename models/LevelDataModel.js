const mongoose = require('mongoose');
const { Schema } = mongoose;

const LevelDataSchema = new Schema({
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

const LevelData = mongoose.model('LevelData', LevelDataSchema);

module.exports = LevelData;
