module.exports = function (req, res) {
  const body = "ok";

  res.status(200);
  res.setHeader("Content-Type", "text/html");
  res.setHeader("X-Organization", "Nintendo");
  res.setHeader("Server", "BigIP");
  res.setHeader("Content-Length", Buffer.byteLength(body));
  res.end(body);
};
