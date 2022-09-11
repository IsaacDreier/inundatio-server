const express = require('express');
const router = express.Router();
const checkJwt = require('../auth');

router.get('/', checkJwt, function (req, res) {
  console.log(req);
  res.send('Hello World');
});

module.exports = router;
