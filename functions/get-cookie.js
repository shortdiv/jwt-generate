const cookie = require("cookie");
const jwt = require("jsonwebtoken");

exports.handler = function(event, context, callback) {
  console.log(event);
  return callback(null, {
    statusCode: 200,
    body: JSON.stringify({})
  });
};
