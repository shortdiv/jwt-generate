exports.handler = function(event, context, callback) {
  console.log("hello");
  callback(null, {
    statusCode: 200,
    body: JSON.stringify({ token: "hi" })
  });
};
