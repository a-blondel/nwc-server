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
      case "acctcreate": {
        // No user DB: hand out a random 13-digit user id (stored by the console).
        const userid = String(Math.floor(1e12 + Math.random() * 9e12));
        ret = {
          retry: "0",
          returncd: "002",
          userid: userid,
        };
        break;
      }
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
        if ("svc" in post) {
          if (post.svc === "9000" || post.svc === "9001") {
            ret["svchost"] = req.headers.host.split(",")[0];
            if (post.svc === "9000") {
              ret["token"] = authtokenSvc;
            } else {
              ret["servicetoken"] = authtokenSvc;
            }
          } else if (post.svc === "0000") {
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
      // YYYYMMDDHHMMSS, like the original server's time.strftime("%Y%m%d%H%M%S")
      ret["datetime"] = new Date().toISOString().replace(/\D/g, "").slice(0, 14);
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
