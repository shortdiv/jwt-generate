const jwt = require("jsonwebtoken");

exports.handler = function(event, context, callback) {
  const getExpiryDate = () => {
    return Math.floor(Date.now() / 1000) + 60 * 60;
  };
  const generateJWT = (expiry, claims) => {
    console.log(expiry);
    console.log(claims);
    jwt.sign(
      {
        expiry,
        app_metadata: {
          authorization: {
            roles: ["admin", "editor"]
          }
        },
        user_metadata: claims
      },
      "this is a secret, shhhhhh"
    );
  };
  const parsedBody = JSON.parse(event.body);
  const expiry = getExpiryDate();
  const token = generateJWT(expiry, parsedBody);

  console.log(parsedBody);
  console.log(token);

  const response = {
    token,
    expiry
  };

  callback(null, {
    statusCode: 200,
    body: JSON.stringify(response)
  });
};
