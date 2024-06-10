var utils = require('./../utils/utils');

module.exports = function(req, res) {
  if (!req.body) {
    res.status(400).send("Request body is missing");
    return;
  }

  try {
    var post = utils.queryStringToMap(req.body);
    var client_address = req.headers["x-forwarded-for"] || req.connection.remoteAddress;

    post["ipaddr"] = client_address;
    var action = post["action"].toLowerCase();

    var ret;
    switch (action) {
      case "login":
        var challenge = utils.generateRandomStr(8);
        var authtoken = utils.generateAuthToken(req.body.userid, req.body);
        ret = {
          retry: "0",
          returncd: "001",
          locator: "gamespy.com",
          challenge: challenge,
          token: authtoken
        };
        break;
      case "svcloc":
        var authtokenSvc = utils.generateAuthToken(req.body.userid, req.body);
        ret = {
          retry: "0",
          returncd: "007",
          statusdata: "Y"
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
      default:
        res.status(400).send("Invalid action");
    }

    if (ret) {
      ret["datetime"] = new Date()
        .toISOString()
        .replace(/T/, "")
        .replace(/\..+/, "");
      var response = utils.mapToQueryString(ret);
      res.setHeader("Content-Length", response.length);
      res.setHeader("Content-type", "text/plain");
      res.setHeader("NODE", "wifiappe1");
      res.send(response);
    }
  } catch (error) {
    console.error("Exception occurred on POST request!", error);
  }
};
