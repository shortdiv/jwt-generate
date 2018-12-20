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
  const generateJWT = (expiry, claims, secret) =>
    jwt.sign(
      {
        expiry,
        app_metadata: {
          user_id: uuidv4(),
          authorization: { roles: ["admin", "editor"] }
        },
        user_metadata: claims
      },
      secret
    );
  const parsedBody = JSON.parse(event.body);
  const { claims, secret } = parsedBody;

  const expiry = getExpiryDate();
  const token = generateJWT(expiry, claims, secret);

  const myCookie = cookie.serialize("nf_jwt", token, {
    secure: true,
    path: "/",
    maxAge: 3600000,
    expires: new Date(expiry.toString())
  });

  const response = {
    statusCode: 200,
    headers: {
      "Set-Cookie": myCookie,
      "Cache-Control": "no-cache",
      "Content-Type": "text/html"
    },
    body: {
      jwt: token,
      exp: expiry
    }
  };

  callback(null, {
    statusCode: 200,
    body: response
  });
};
