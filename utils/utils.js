const crypto = require("crypto");
const querystring = require("querystring");


function base64Encode(input) {
  let output = Buffer.from(input).toString("base64");
  output = output.replace("+", "[").replace("/", "]").replace("=", "_");
  return output;
}


function queryStringToMap(str) {
  let queryString = querystring.stringify(str);
  let ret = querystring.parse(queryString);

  for (let k in ret) {
    try {
      ret[k] = Buffer.from(
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
  let ret = {};

  for (let k in map) {
    let encoded =  Buffer.from(map[k]).toString("base64");
    encoded = encoded.replace("=", "*");
    ret[k] = encoded;
  }

  return querystring.stringify(ret) + "\r\n";
}

function generateRandomStr(length, characters) {
  characters = characters || "";
  const charset =
    characters || "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  while (result.length < length) {
    const buf = crypto.randomBytes(length);
    for (let i = 0; i < buf.length && result.length < length; i++) {
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
  queryStringToMap,
  mapToQueryString,
  generateRandomStr,
  generateAuthToken,
};
