const jwt = require("jsonwebtoken");
const uuidv4 = require("uuid/v4");
const cookie = require("cookie");
const axios = require("axios");

exports.handler = function(event, context, callback) {
  const getExpiryDate = () => {
    const exp = Math.floor(Date.now() / 1000) + 60 * 60;
    // const expReadable = new Date(exp);
    return exp;
  };
  const generateJWT = (exp, claims, roles, secret) =>
    jwt.sign(
      {
        exp,
        app_metadata: {
          user_id: uuidv4(),
          authorization: { roles }
        },
        user_metadata: claims
      },
      secret
    );
  const parsedBody = JSON.parse(event.body);
  const { claims, roles, secret } = parsedBody;

  const expiry = getExpiryDate();
  const token = generateJWT(expiry, claims, roles, secret);

  const netlifyCookie = cookie.serialize("nf_jwt", token, {
    secure: true,
    path: "/",
    expires: new Date(expiry.toString())
  });

  const response = {
    jwt: token,
    exp: expiry
  };

  callback(null, {
    statusCode: 200,
    headers: {
      "Set-Cookie": netlifyCookie,
      "Cache-Control": "no-cache"
    },
    body: JSON.stringify(response)
  });
};
