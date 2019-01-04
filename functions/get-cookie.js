const cookie = require("cookie");
const jwt = require("jsonwebtoken");

exports.handler = function(event, context, callback) {
  const { headers } = event;
  const cookieHeader = headers.cookie || "";
  const cookies = cookie.parse(cookieHeader);

  let decodedToken, roles, message, originalToken;
  try {
    originalToken = cookies.nf_jwt;
    decodedToken = jwt.decode(cookies.nf_jwt, { complete: true });
    roles =
      decodedToken !== null
        ? decodedToken.payload.app_metadata.authorization.roles
        : [];
  } catch (e) {
    console.log(e);
  }
  if (decodedToken === null) {
    message = "You have not provided a valid token";
  } else if (roles.indexOf("admin") === -1 && roles.indexOf("editor") === -1) {
    message = "You do not have the right access privileges";
    decodedToken = null;
  }
  callback(null, {
    statusCode: 200,
    body: JSON.stringify({ originalToken, decodedToken, message })
  });
};
