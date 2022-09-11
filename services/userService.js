const User = require('../models/UserModel');
const { isAlphanumeric } = require('validator');

/**
 * Get's the data for a single user
 * @param {String} id the user id
 * @returns
 */

exports.getUserInfo = async (id) => {
  try {
    const userInfo = await User.findById(id).exec();
    return userInfo;
  } catch (err) {
    return Promise.reject(err);
  }
};

/**
 * Creates a user
 * @param {String} id user id
 * @param {String} nickname nickname to be used in a UI
 * @param {String} phone the user's phone number
 * @param {String} email the user's email address
 * @param {String} site the user's current USGS site
 * @returns
 */

exports.createUser = async (id, nickname, phone, email, site) => {
  try {
    const user = new User({
      _id: id,
      nickname: nickname,
      benchmarks: [],
      phone: phone,
      email: email,
      site: site || '03148000',
      visits: 0,
    });
    await user.save();
  } catch (error) {
    throw error;
  }
};

/**
 * Update the nickname, phone number, email address, and/or USGS site of a user
 * @param {String} id user id to update
 * @param {Object} fields the updateable options
 * @param {String} fields.nickname the user's nickname
 * @param {String} fields.phone the user's phone number
 * @param {String} fields.email the user's email address
 * @param {String} fields.site the user's current USGS site
 */

exports.updateUser = async (id, { nickname, phone, email, site }) => {
  if (!isAlphanumeric(id) || id.length > 200) throw 'user id is invalid';
  try {
    const user = await User.findById(id).exec();
    if (user === null) throw 'user not found';
    if (nickname != undefined) user.nickname = nickname;
    if (phone != undefined) user.phone = phone;
    if (email != undefined) user.email = email;
    if (site != undefined) user.site = site;
    await user.save();
  } catch (error) {
    throw error;
  }
};

/**
 * Deletes a user
 * @param {String} id user id
 */

exports.deleteUser = async (id) => {
  if (!isAlphanumeric(id) || id.length > 200) throw 'user id is invalid';
  try {
    await User.deleteOne({ _id: id });
  } catch (error) {
    throw error;
  }
};

/**
 * Creates a benchmark
 * @param {String} id the id of the user to apply the benchmark to
 * @param {Number} value the benchmark threshold
 * @param {String} comparison 'greater' or 'less'
 * @param {Boolean} alert whether or not to alert if this benchmark is reached
 * @param {String} site the USGS site to which this benchmark applies
 */

exports.createBenchmark = async (id, value, comparison, shouldAlert, site) => {
  try {
    const user = await User.findById(id).exec();
    if (user === null) throw 'user not found';
    user.benchmarks.push({
      value: value,
      comparison: comparison,
      shouldAlert: shouldAlert,
      site: site,
    });
    await user.save();
  } catch (error) {
    throw error;
  }
};

/**
 * Delete a benchmark
 * @param {String} userId
 * @param {String} benchmarkId
 */

exports.deleteBenchmark = async (userId, benchmarkId) => {
  if (!isAlphanumeric(userId) || userId.length > 200)
    throw 'user id is invalid';
  if (!isAlphanumeric(benchmarkId) || benchmarkId.length > 200)
    throw 'benchmark id is invalid';
  try {
    const user = await User.findById(userId).exec();
    if (user === null) throw 'user not found';
    const benchmark = user.benchmarks.id(benchmarkId);
    if (benchmark === null) throw 'benchmark not found';
    await benchmark.remove();
    await user.save();
  } catch (error) {
    throw error;
  }
};

/**
 *
 * @param {String} userId
 * @param {String} benchmarkId
 * @param {Object} fields the updatable fields
 * @param {Number} fields.value the benchmark threshold
 * @param {String} fields.comparison either 'greater' or 'less'
 * @param {Boolean} fields.shouldAlert whether or not a user should be alerted when the threshold is reached
 * @param {String} fields.site the USGS site to which this benchmark applies
 */

exports.updateBenchmark = async (
  userId,
  benchmarkId,
  { value, comparison, shouldAlert, site }
) => {
  if (!isAlphanumeric(userId) || userId.length > 200)
    throw 'user id is invalid';
  if (!isAlphanumeric(benchmarkId) || benchmarkId.length > 200)
    throw 'benchmark id is invalid';
  try {
    const user = await User.findById(userId).exec();
    if (user === null) throw 'user not found';
    const benchmark = user.benchmarks.id(benchmarkId);
    if (benchmark === null) throw 'benchmark not found';
    if (value != undefined) benchmark.value = value;
    if (comparison != undefined) benchmark.comparison = comparison;
    if (shouldAlert != undefined) benchmark.shouldAlert = shouldAlert;
    if (site != undefined) benchmark.site = site;
    await user.save();
  } catch (error) {
    throw error;
  }
};
