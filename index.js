const express = require("express");
const app = express();
// This is the file that you have to create.
// Copy the template in the current directory.
const config = require("./_config.json");


// Defaults for host and port if null.
if (!config.host) {config.host = "localhost"}
if (!config.port) {config.port = 80}


// Main page.
app.get(config.base, (request, response) => {
    response.send("Hello World!");
});


// Handle POST requests.
app.post(config.base + config.endpoint, (request, response) => {
    response.send(request);
});


app.listen(config.port, () => {
    // Tell them where the site is being served.
    console.log("Server is listening on http://" +
        config.host + ":" + config.port + config.base);
});
