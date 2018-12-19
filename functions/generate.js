const jwt = require("jsonwebtoken");
const uuidv4 = require("uuid/v4");

exports.handler = function(event, context, callback) {
  const getExpiryDate = () => {
    const addHours = function(time, hours) {
      time.setTime(time.getTime() + hours * 60 * 60 * 1000);
      return time;
    };
    var now = new Date();
    now = addHours(now, 1);
    return new Date(now);
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

  console.log(parsedBody);
  console.log(token);

  const response = {
    jwt: token,
    exp: expiry
  };

  callback(null, {
    statusCode: 200,
    body: JSON.stringify(response)
  });
};
