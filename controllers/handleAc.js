const { qs_to_dict } = require('./../utils/utils');
const { dict_to_qs } = require('./../utils/utils');
const { generateRandomStr } = require('./../utils/utils');
const { generateAuthToken } = require('./../utils/utils');

module.exports = (req, res) => {
  if (!req.body) {
    res.status(400).send("Request body is missing");
    return;
  }

  try {
    const post = qs_to_dict(req.body);
    const client_address =
      req.headers["x-forwarded-for"] || req.connection.remoteAddress;

    post["ipaddr"] = client_address;

    const action = post["action"].toLowerCase();

    let ret;

    switch (action) {
      case "login":
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
      case "svcloc":
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
      default:
        res.status(400).send("Invalid action");
    }

    if (ret) {
      ret["datetime"] = new Date()
        .toISOString()
        .replace(/T/, "")
        .replace(/\..+/, "");
      const response = dict_to_qs(ret);
      res.setHeader("Content-Length", response.length);
      res.setHeader("Content-type", "text/plain");
      res.setHeader("NODE", "wifiappe1");
      res.send(response);
    }
  } catch (error) {
    console.error("Exception occurred on POST request!", error);
  }
};
