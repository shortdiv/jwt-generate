const cookie = require("cookie");
const jwt = require("jsonwebtoken");

exports.handler = function(event, context, callback) {
  const { headers } = event;
  const cookieHeader = headers.cookie || "";
  const cookies = cookie.parse(cookieHeader);

  let decodedToken;
  try {
    decodedToken = jwt.decode(cookies.nf_jwt, { complete: true });
    console.log(decodedToken);
  } catch (e) {
    console.log(e);
  }
  callback(null, {
    statusCode: 200,
    body: JSON.stringify({ decodedToken })
  });
};
