const mongoose = require('mongoose');
const { Schema } = mongoose;

const SiteSchema = new Schema({
  _id: { type: String, required: true },
  agency: { type: String, required: true },
  name: { type: String, required: true },
  type: String,
  latDec: { type: Number, required: true },
  longDec: { type: Number, required: true },
  coordDatum: String,
  district: String,
  state: String,
  county: String,
  country: String,
  altitude: Number,
  altDatum: String,
});

const Site = new mongoose.model('Site', SiteSchema);

module.exports = Site;
