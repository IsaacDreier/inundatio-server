const mongoose = require('mongoose');
const { Schema } = mongoose;

const SiteSchema = new Schema({
  _id: { type: String, required: true },
  agency: { type: String, required: true },
  name: { type: String, required: true },
  type: String,
  location: {
    type: { type: 'String', default: 'Point' },
    coordinates: [Number],
  },
  coordDatum: String,
  district: String,
  state: String,
  county: String,
  country: String,
  altitude: Number,
  altDatum: String,
});

SiteSchema.index({ location: '2dsphere' });
const Site = new mongoose.model('Site', SiteSchema);

module.exports = Site;
