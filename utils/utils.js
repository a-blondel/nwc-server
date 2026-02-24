const crypto = require("crypto");
const querystring = require("querystring");

function base64Encode(input) {
  let output = Buffer.from(input).toString("base64");
  output = output.replaceAll("+", "[").replaceAll("/", "]").replaceAll("=", "_");
  return output;
}

function queryStringToMap(body) {
  const qs = querystring.stringify(body);
  const ret = querystring.parse(qs);

  for (const k in ret) {
    try {
      ret[k] = Buffer.from(
        decodeURIComponent(ret[k])
          .replaceAll("*", "=")
          .replaceAll("?", "/")
          .replaceAll(">", "+")
          .replaceAll("-", "/"),
        "base64"
      ).toString("utf8");
    } catch (e) {
      // keep original value if decoding fails
    }
  }

  return ret;
}

function mapToQueryString(map) {
  const ret = {};

  for (const k in map) {
    let encoded = Buffer.from(map[k]).toString("base64");
    encoded = encoded.replaceAll("=", "*");
    ret[k] = encoded;
  }

  return querystring.stringify(ret) + "\r\n";
}

function generateRandomStr(length) {
  const charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  const buf = crypto.randomBytes(length);
  for (let i = 0; i < length; i++) {
    result += charset.charAt(buf[i] % charset.length);
  }
  return result;
}

function generateAuthToken(userid, data) {
  const authtoken = "NDS" + generateRandomStr(80);

  if ("devname" in data) {
    data["devname"] = base64Encode(data["devname"]);
  }
  if ("ingamesn" in data) {
    data["ingamesn"] = base64Encode(data["ingamesn"]);
  }

  return authtoken;
}

module.exports = {
  queryStringToMap,
  mapToQueryString,
  generateRandomStr,
  generateAuthToken,
};
