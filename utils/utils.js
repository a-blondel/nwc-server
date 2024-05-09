const crypto = require("crypto");
const querystring = require("querystring");


function base64Encode(input) {
  var output = new Buffer(input).toString("base64");
  output = output.replace("+", "[").replace("/", "]").replace("=", "_");
  return output;
}


function queryStringToMap(queryString) {
  var queryString = querystring.stringify(queryString);
  var ret = querystring.parse(queryString);

  for (var k in ret) {
    try {
      ret[k] =new Buffer(
        decodeURIComponent(ret[k])
          .replace("*", "=")
          .replace("?", "/")
          .replace(">", "+")
          .replace("-", "/"),
        "base64"
      ).toString("utf8");
    } catch (e) {
      ret[k] = ret[k];
    }
  }

  return ret;
}

function mapToQueryString(map) {
  var ret = {};

  for (var k in map) {
    var encoded =  new Buffer(map[k]).toString("base64");
    encoded = encoded.replace("=", "*");
    ret[k] = encoded;
  }

  return querystring.stringify(ret) + "\r\n";
}

function generateRandomStr(length, characters) {
  characters = characters || "";
  const charset =
    characters || "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  var result = "";
  while (result.length < length) {
    const buf = crypto.randomBytes(length);
    for (var i = 0; i < buf.length && result.length < length; i++) {
      const randomChar = charset.charAt(buf[i] % charset.length);
      result += randomChar;
    }
  }
  return result;
}

function generateAuthToken(userid, data) {
  const size = 80;
  const authtoken = "NDS" + generateRandomStr(size);

  if ("devname" in data) {
    data["devname"] = base64Encode(data["devname"]);
  }
  if ("ingamesn" in data) {
    data["ingamesn"] = base64Encode(data["ingamesn"]);
  }

  data = JSON.stringify(data);

  return authtoken;
}

module.exports = {
  queryStringToMap: queryStringToMap,
  mapToQueryString: mapToQueryString,
  generateRandomStr: generateRandomStr,
  generateAuthToken: generateAuthToken,
};
