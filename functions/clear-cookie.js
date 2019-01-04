const cookie = require("cookie");
const jwt = require("jsonwebtoken");

exports.handler = function(event, context, callback) {
  const netlifyCookie = cookie.serialize("nf_jwt", null, {
    secure: true,
    path: "/",
    expires: new Date()
  });

  callback(null, {
    statusCode: 200,
    headers: {
      "Set-Cookie": netlifyCookie,
      "Cache-Control": "no-cache"
    },
    body: JSON.stringify({ message: "Cookie has been removed" })
  });
};
