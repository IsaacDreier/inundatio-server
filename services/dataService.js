const LevelData = require('../models/LevelDataModel');
const Location = require('../models/LocationModel');
const { isPostalCode, isAlphanumeric } = require('validator');
/**
 * Inserts data from array
 * @param {Array} data array of
 */

exports.insertLevelData = async (data) => {
  let docs = data.map((datum) => {
    return { value: datum.value, timestamp: datum.timestamp, site: datum.site };
  });
  await LevelData.insertMany(docs);
};

/**
 * Deletes all data before a given date
 * @param {Date} date
 */

exports.deleteLevelDataBefore = async (date) => {
  await LevelData.deleteMany({ timestamp: { $lt: date } });
};

/**
 *  Returns a list of documents for a certain site after a date
 * @param {String} site USGS site id
 * @param {Date} date
 * @returns <Promise>
 */

exports.findBySiteAfterDate = async (site, date) => {
  return await LevelData.find({ site: site, timestamp: { $gt: date } }).exec();
};

exports.findMostRecentForSite = async (site) => {
  return await LevelData.findOne({ site: site }).sort({ timestamp: -1 }).exec();
};

exports.findMaxForSite = async (site) => {
  return await LevelData.findOne({ site: site }).sort({ value: -1 }).exec();
};

exports.findMinForSite = async (site) => {
  return await LevelData.findOne({ site }).sort({ value: 1 }).exec();
};

exports.getLocationByZipcode = async (zip) => {
  if (!isPostalCode(zip, 'US')) throw new Error(`${zip} is not a zipcode`);
  return await Location.findOne({ zip: zip }).exec();
};

exports.getLocationsByName = async (name) => {
  if (!isAlphanumeric(name, 'en-US', { ignore: " -,'" }))
    throw new Error('illegal characters in name parameter');
  const locations = await Location.find({ $text: { $search: name } });
  return locations;
};
