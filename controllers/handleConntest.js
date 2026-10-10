/**
 * Connection test handler.
 *
 * Nintendo consoles run a system connection test that performs a GET on
 * conntest.nintendowifi.net. The Wii only validates the
 * "X-Organization: Nintendo" response header, but the Wii U also checks the
 * body, so the response below reproduces Nintendo's actual test page rather
 * than the bare "ok" used by barronwaffles/dwc_network_server_emulator
 * (nas_server.py, do_GET). Serving the full page satisfies both consoles.
 *
 * Body and headers follow PretendoNetwork/account
 * (src/services/conntest/index.ts), which is the Wii U / 3DS equivalent of dwc.
 */
const BODY = `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html>
<head>
<title>HTML Page</title>
</head>
<body bgcolor="#FFFFFF">
This is test.html page
</body>
</html>
`;

module.exports = function (req, res) {
  res.status(200);
  // res.setHeader is used instead of res.set so Express does not append a
  // charset to the content type, keeping the response close to the original.
  res.setHeader("Content-Type", "text/html");
  res.setHeader("X-Organization", "Nintendo");
  res.setHeader("Server", "BigIP");
  res.setHeader("Content-Length", Buffer.byteLength(BODY));
  res.end(BODY);
};
