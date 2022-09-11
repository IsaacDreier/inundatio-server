const {
  getUserInfo,
  createUser,
  updateUser,
  createBenchmark,
  updateBenchmark,
  deleteBenchmark,
} = require('../services/userService');

const { isAlphanumeric } = require('validator');

exports.userInfo = async (req, res) => {
  try {
    const userInfo = await getUserInfo(req.auth.payload.azp);
    res.json(userInfo);
  } catch (err) {
    console.log(err);
    res.status(500).send('Server Error');
  }
};

exports.createuser = async (req, res) => {
  try {
    const id = req.auth.payload.azp;
    const { nickname, phone, email, site } = req.body;
    await createUser(id, nickname, phone, email, site);
    res.status(200).json({ status: 'User Created' });
  } catch (err) {
    console.log(err);
    res.status(500).send('Server Error');
  }
};

exports.updateUser = async (req, res) => {
  try {
    const id = req.auth.payload.azp;
    const { nickname, phone, email, site } = req.body;
    await updateUser(id, {
      nickname,
      phone,
      email,
      site,
    });
    res.status(200).send('User has been updated!');
  } catch (error) {
    console.log(err);
    res.status(500).send('Server Error');
  }
};

exports.createBenchmark = async (req, res) => {
  try {
    const id = req.auth.payload.azp;
    const { value, comparison, shouldAlert, site } = req.body;
    await createBenchmark(id, value, comparison, shouldAlert, site);
    res.status(200).send('Benchmark Created!');
  } catch (error) {
    console.log(error);
    res.status(500).send('Server Error');
  }
};

exports.setBenchmarkShouldAlert = async (req, res) => {
  try {
    const id = req.auth.payload.azp;
    const benchmarkId = req.params.benchmark;
    const shouldAlert = req.body.shouldAlert;
    await updateBenchmark(id, benchmarkId, { shouldAlert });
    res.status(200).send('Benchmark updated!');
  } catch (error) {
    console.log(error);
    res.status(500).send('Server Error');
  }
};

exports.deleteBenchmark = async (req, res) => {
  try {
    const id = req.auth.payload.azp;
    const benchmarkId = req.params.benchmark;
    await deleteBenchmark(id, benchmarkId);
    res.status(200).send('Benchmark Deleted');
  } catch (error) {
    console.log(error);
    res.status(500).send('Server Error');
  }
};
