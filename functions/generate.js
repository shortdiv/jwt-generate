const jwt = require("jsonwebtoken");

exports.handler = function(event, context, callback) {
  const getExpiry = () => {
    return Math.floor(Date.now() / 1000) + 60 * 60;
  };
  const generateJWT = ({ expiry, claims }) => {
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
      secret
    );
  };
  const parsedBody = JSON.parse(event.body);
  console.log(parsedBody);
};
