const express = require('express');
const router = express.Router();
const checkJwt = require('../auth');
const userController = require('../controllers/userController');

router.get('/', checkJwt, userController.userInfo);

router.post('/', checkJwt, userController.createuser);

router.put('/', checkJwt, userController.updateUser);

router.post('/benchmark', checkJwt, userController.createBenchmark);

router.put(
  '/benchmark/:benchmark',
  checkJwt,
  userController.setBenchmarkShouldAlert
);

router.delete(
  '/benchmark/:benchmark',
  checkJwt,
  userController.deleteBenchmark
);

module.exports = router;
