const Data = require('../models/DataModel');

/**
 * Inserts data from array
 * @param {Array} data array of
 */

exports.insertData = async (data) => {
  let docs = data.map((datum) => {
    return { value: datum.value, timestamp: datum.timestamp, site: datum.site };
  });
  await Data.insertMany(docs);
};

/**
 * Deletes all data before a given date
 * @param {Date} date
 */

exports.deleteBefore = async (date) => {
  await Data.deleteMany({ timestamp: { $lt: date } });
};

/**
 *  Returns a list of documents for a certain site after a date
 * @param {String} site USGS site id
 * @param {Date} date
 * @returns <Promise>
 */

exports.findBySiteAfterDate = async (site, date) => {
  return await Data.find({ site: site, timestamp: { $gt: date } }).exec();
};

exports.findMostRecentForSite = async (site) => {
  return await Data.findOne({ site: site }).sort({ timestamp: -1 }).exec();
};

exports.findMaxForSite = async (site) => {
  return await Data.findOne({ site: site }).sort({ value: -1 }).exec();
};

exports.findMinForSite = async (site) => {
  return await Data.findOne({ site }).sort({ value: 1 }).exec();
};
