const express = require("express");
const parser = require("body-parser");
const app = express();
// This is the file that you have to create.
// Copy the template in the current directory.
const config = require("./_config.json");
const fs = require("fs");
const router = require('./routes/auth');

// Defaults for host and port if null.
if (!config.host) {
  config.host = "localhost"
}
if (!config.port) {
  config.port = 80
}

app.use(config.base + config.endpoint, parser.json({ type: "application/json" }));

app.use(`${config.base}/auth`, router);

// Main page.
app.get(config.base, (request, response) => {
  console.log(request);
  if (request.user != null) {
    return response.send(request.user.username);
  }
  response.send("Hello World!");
});


// Handle POST requests.
app.post(config.base + config.endpoint, (request, response) => {
  fs.readFile("pending.json", "utf8", (error, data) => {
    if (error) {
      console.log(error);
    } else {
      let pending = JSON.parse(data);
      pending[request.body.id] = request.body;
      fs.writeFile("pending.json", JSON.stringify(pending), "utf8", (error) => {
        if (error) {
          console.log(error);
        }
      });
    }
  });
  // Response OK
  response.send(200);
});


app.listen(config.port, () => {
  // Tell them where the site is being served.
  console.log("Server is listening on http://" +
    config.host + ":" + config.port + config.base);
});
