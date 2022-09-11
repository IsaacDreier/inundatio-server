const { auth } = require('express-oauth2-jwt-bearer');

const checkJwt = auth({
  audience: 'https://inundatio.isaacdreier.com',
  issuerBaseURL: 'https://dev-f4zzlfus.us.auth0.com/',
});

module.exports = checkJwt;
