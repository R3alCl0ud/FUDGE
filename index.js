const express = require("express"),
  session = require('express-session'),
  passport = require('passport'),
  Strategy = require('passport-discord').Strategy;
const parser = require("body-parser");
const app = express();
// This is the file that you have to create.
// Copy the template in the current directory.
const config = require("./_config.json");
const fs = require("fs");
// const router = require('./routes/auth');
const router = express.Router();

// Defaults for host and port if null.
if (!config.host) {
  config.host = "localhost"
}
if (!config.port) {
  config.port = 80
}
passport.serializeUser(function(user, done) {
  done(null, user);
});
passport.deserializeUser(function(obj, done) {
  done(null, obj);
});
const passInit = passport.initialize()
const passSess = passport.session()

app.use(config.base + config.endpoint, parser.json({ type: "application/json" }));
app.use(`${config.base}/auth`, router);
router.use(parser.json()); // support json encoded bodies
router.use(parser.urlencoded({ extended: true }));

const ses = session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: false
})


app.use(ses);
router.use(ses);


var scopes = ['identify', 'guilds'];
passport.use(new Strategy({
  clientID: config.clientID,
  clientSecret: config.clientSecret,
  callbackURL: 'http://localhost/fudge/auth/callback',
  scope: scopes
}, (accessToken, refreshToken, profile, done) => {
  // console.log(profile);
  process.nextTick(() => done(null, profile));
}));

app.use(passInit);
router.use(passInit);
app.use(passSess);
router.use(passSess);


router.get('/login', passport.authenticate('discord', {
  scope: scopes
}), (req, res) => {});

router.get('/callback',
  passport.authenticate('discord', {
    failureRedirect: '/'
  }),
  (req, res) => {
    // console.log(req.query);
    res.redirect('info');
  } // auth success
);

router.get('/info', checkAuth, (req, res) =>res.redirect(`${config.base}`) )


function checkAuth(req, res, next) {
  if (req.isAuthenticated()) return next();
  console.log('fuck off');
  res.redirect(config.base);
}

// Main page.
app.get(config.base, (req, response) => {
  let user = req.user;
  if (user != null) {
    return response.send(req.user.username);
  }


  response.send("Hello World!");
});

app.get(`${config.base}/info`, checkAuth, (req, res) => {
  res.json(req.user);
})

// Handle POST requests.
app.post(config.base + config.endpoint, (request, response) => {
  fs.readFile("pending.json", "utf8", (error, data) => {
    if (error) {
      console.log(error);
    } else {
      let pending = JSON.parse(data);
      pending[request.body.id] = request.body;
      fs.writeFile("pending.json", JSON.stringify(pending, "\t"), "utf8", (error) => {
        if (error) {
          console.log(error);
        }
      });
    }
  });
  response.send(200);
});


app.listen(config.port, (err) => {
  if (err) return console.log(err);
  // Tell them where the site is being served.
  console.log("Server is listening on http://" +
    config.host + ":" + config.port + config.base);
});
