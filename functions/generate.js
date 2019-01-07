const jwt = require("jsonwebtoken");
const uuidv4 = require("uuid/v4");
const cookie = require("cookie");

exports.handler = function(event, context, callback) {
  const getExpiryDate = () => {
    const addHours = function(time, hours) {
      time.setTime(time.getTime() + hours * 60 * 60 * 1000);
      return time;
    };
    var now = new Date();
    now = addHours(now, 1);
    return new Date(now.toString());
  };
  const generateJWT = (expiry, claims, roles, secret) =>
    jwt.sign(
      {
        expiry,
        app_metadata: {
          user_id: uuidv4(),
          authorization: { roles }
        },
        user_metadata: claims
      },
      secret
    );
  const parsedBody = JSON.parse(event.body);
  const { claims, roles, secret, gatedSites } = parsedBody;

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

  //set cookies//
  gatedSites.map(site => {
    `${site}/.netlify/functions/set-cookie?token=${token}`;
  });

  callback(null, {
    statusCode: 200,
    headers: {
      "Set-Cookie": netlifyCookie,
      "Cache-Control": "no-cache"
    },
    body: JSON.stringify(response)
  });
};
