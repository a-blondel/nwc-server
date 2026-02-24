const { queryStringToMap, mapToQueryString, generateRandomStr, generateAuthToken } = require("../utils/utils");

module.exports = function (req, res) {
  if (!req.body || Object.keys(req.body).length === 0) {
    return res.status(400).send("Request body is missing");
  }

  try {
    const post = queryStringToMap(req.body);
    const action = (post["action"] || "").toLowerCase();

    let ret;
    switch (action) {
      case "login": {
        const challenge = generateRandomStr(8);
        const authtoken = generateAuthToken(req.body.userid, req.body);
        ret = {
          retry: "0",
          returncd: "001",
          locator: "gamespy.com",
          challenge: challenge,
          token: authtoken,
        };
        break;
      }
      case "svcloc": {
        const authtokenSvc = generateAuthToken(req.body.userid, req.body);
        ret = {
          retry: "0",
          returncd: "007",
          statusdata: "Y",
        };
        if ("svc" in req.body) {
          if (req.body.svc === "9000" || req.body.svc === "9001") {
            ret["svchost"] = req.headers.host.split(",")[0];
            if (req.body.svc === "9000") {
              ret["token"] = authtokenSvc;
            } else {
              ret["servicetoken"] = authtokenSvc;
            }
          } else if (req.body.svc === "0000") {
            ret["servicetoken"] = authtokenSvc;
            ret["svchost"] = "n/a";
          } else {
            ret["svchost"] = "n/a";
            ret["servicetoken"] = authtokenSvc;
          }
        }
        break;
      }
      default:
        return res.status(400).send("Invalid action");
    }

    if (ret) {
      ret["datetime"] = new Date()
        .toISOString()
        .replace(/T/, "")
        .replace(/\..+/, "");
      const body = mapToQueryString(ret);
      //console.log(`[${new Date().toISOString()}] POST /ac action=${action} from=${req.ip}`);
      res.set("Content-Type", "text/plain");
      res.set("NODE", "wifiappe1");
      res.send(body);
    }
  } catch (error) {
    console.error("Exception occurred on POST /ac:", error);
    res.status(500).send("Internal Server Error");
  }
};
