const express = require('express'),
  session = require('express-session'),
  passport = require('passport'),
  Strategy = require('passport-discord').Strategy,
  bodyParser = require('body-parser');

var router = express.Router();
const config = require("../_config.json");

console.log(express)

router.use(bodyParser.json()); // support json encoded bodies
router.use(bodyParser.urlencoded({extended: true}));

var passInit = passport.initialize()
var passSess = passport.session()
router.use(passInit);
router.use(passSess);

router.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: false
}));

passport.serializeUser(function(user, done) {
  done(null, user);
});
passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

var scopes = ['identify', 'guilds'];
passport.use(new Strategy({
  clientID: config.clientID,
  clientSecret: config.clientSecret,
  callbackURL: 'fudge/auth/callback',
  scope: scopes
}, function(accessToken, refreshToken, profile, cb) {
  process.nextTick(function() {
    return cb(null, profile);
  });
}));

router.get('/login', passport.authenticate('discord', {
  scope: scopes
}), (req, res) => {});

router.get('/callback',
  passport.authenticate('discord', {
    failureRedirect: '../'
  }),
  function(req, res) {
    console.log(req.query);
    res.redirect('../')
  } // auth success
);


module.exports = router;
