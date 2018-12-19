const jwt = require("jsonwebtoken");
const uuidv4 = require("uuid/v4");

exports.handler = function(event, context, callback) {
  const getExpiryDate = () => {
    var now = new Date();
    now.setTime(now.getTime() / 1000 + 60 * 60);
    return now;
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
