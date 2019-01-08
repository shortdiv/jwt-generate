exports.handler = function(event, context, callback) {
  const params = event.queryStringParameters;

  console.log(params.site);

  callback(null, {
    statusCode: 200,
    body: JSON.stringify({ message: "hello" })
  });
};
