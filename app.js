const express = require("express");
const handleAc = require("./controllers/handleAc");
const handleConntest = require("./controllers/handleConntest");

const app = express();
const PORT = 80;

app.disable("x-powered-by");

app.use(express.urlencoded({ extended: false }));

app.post("/ac", handleAc);

app.get("/health", (req, res) => {
  res.send("OK");
});

// Connection test, answered on every remaining GET path (see handleConntest).
app.get(/.*/, handleConntest);

app.use((req, res) => {
  res.status(404).send("Not Found");
});

app.listen(PORT, () => {
  console.log(`NWC server listening on port ${PORT}`);
});
