const cookie = require("cookie");
const jwt = require("jsonwebtoken");
const parseURL = require("url-parse");

exports.handler = function(event, context, callback) {
  const params = event.queryStringParameters;
  const referer = event.headers.referer
  const urlData = parseURL(params.site);
  const redirectBaseUrl = urlData.origin;
  const redirectUrl = urlData.href;

  //check that cookies are present
  const { headers } = event;
  const cookieHeader = headers.cookie || "";
  const cookies = cookie.parse(cookieHeader);

  if (cookieHeader === "" || !cookies.nf_jwt) {
    const redirectToURL = redirectUrl
      ? `${referer}?site=${redirectUrl}`
      : referer;
    return callback(null, {
      statusCode: 302,
      headers: {
        Location: redirectToURL,
        "Cache-Control": "no-cache"
      },
      body: JSON.stringify({ message: "cookie is not present" })
    });
  }

  let decodedToken, roles, message, originalToken;
  try {
    originalToken = cookies.nf_jwt;
    decodedToken = jwt.decode(cookies.nf_jwt, { complete: true });
  } catch (e) {
    console.log(e);
  }

  if (decodedToken === null) {
    return callback(null, {
      statusCode: 401,
      body: JSON.stringify({
        message: `Your token is invalid. Logout and log back in`
      })
    });
  }

  console.log(decodedToken.payload);

  callback(null, {
    statusCode: 302,
    headers: {
      Location: `${redirectBaseUrl}/.netlify/functions/set-cookie?token=${originalToken}&url=${redirectUrl}`,
      "Cache-Control": "no-cache"
    },
    body: JSON.stringify({ message: "hello" })
  });
};
