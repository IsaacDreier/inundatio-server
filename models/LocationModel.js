const mongoose = require('mongoose');
const { isPostalCode, isAlphanumeric } = require('validator');
const { Schema } = mongoose;

const LocationSchema = new Schema({
  country: String,
  zip: {
    type: String,
    required: true,
    trim: true,
    validator: {
      validate: (v) => isPostalCode(v, 'US'),
      message: (p) => `${p} is not a valid postal code`,
    },
  },
  name: {
    type: String,
    trim: true,
    required: true,
    validator: {
      validate: (v) => !isAlphanumeric(v, 'en-US', { ignore: " -,'" }),
      message: (p) => `name contains illegal characters`,
    },
  },
  state: {
    type: String,
    trim: true,
    required: true,
    validator: {
      validate: (v) => !isAlphanumeric(v, 'en-US', { ignore: " -,'" }),
      message: (p) => `name contains illegal characters`,
    },
  },
  lat: {
    type: Number,
    required: true,
  },
  long: {
    type: Number,
    required: true,
  },
});

LocationSchema.index({ name: 'text', state: 'text' });
const Location = new mongoose.model('Location', LocationSchema);

module.exports = Location;
