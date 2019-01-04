const cookie = require("cookie");
const jwt = require("jsonwebtoken");

exports.handler = function(event, context, callback) {
  const { headers } = event;
  const cookieHeader = headers.cookie || "";
  const cookies = cookie.parse(cookieHeader);

  console.log(headers);
  let decodedToken, roles;
  try {
    decodedToken = jwt.decode(cookies.nf_jwt, { complete: true });
    roles =
      decodedToken !== null
        ? decodedToken.payload.app_metadata.authorization.roles
        : [];
  } catch (e) {
    console.log(e);
  }
  if (
    decodedToken === null ||
    (roles.indexOf("admin") === -1 || roles.indexOf("editor") === -1)
  ) {
    return callback(null, {
      statusCode: 200,
      body: JSON.stringify({
        message: `You do not have access privileges.`
      })
    });
  }
  callback(null, {
    statusCode: 200,
    body: JSON.stringify({ decodedToken })
  });
};
