var LocalStrategy   = require('passport-local').Strategy;
var User            = require('../models/userSchema');

module.exports = function(passport) {
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });

    // =========================================================================
    // LOCAL SIGNUP ============================================================
    // =========================================================================
    passport.use('local-signup', new LocalStrategy({
        usernameField : 'username',
        passwordField : 'password',
        passReqToCallback : true
    },
    function(req, username, password, done) {
        process.nextTick(function() {
          User.findOne({ 'profile.username' : username }, function(err, user) {
              if (err)
                  return done(err);

              if (user) {
                  return done(null, false, req.flash('signupMessage', 'Este nome de usuário já existe'));
              }
              else {
                  var newUser            = new User();

                  newUser.profile.username    = username;
                  newUser.profile.password    = req.param('password');
                  newUser.profile.firstname   = req.param('firstname');
                  newUser.profile.lastname    = req.param('lastname');
                  newUser.profile.mail        = req.param('email');
                  newUser.profile.admin       = req.param('admin');
                  newUser.save(function(err) {
                      if (err)
                          throw err;
                      return done(null, newUser);
                  });
              }
          });
        });
    }));

    // =========================================================================
    // LOCAL LOGIN =============================================================
    // =========================================================================
    passport.use('local-login', new LocalStrategy({
        usernameField : 'username',
        passwordField : 'password',
        passReqToCallback : true
    },
    function(req, username, password, done) {
        User.findOne({"$or": [{ 'profile.username' :  username},
                             {'profile.mail' :  username  }]}, function(err, user) {
            if (err)
                return done(err);

            if (!user)
                return done(null, false, req.flash('loginMessage', 'Usuário não encontrado!'));

            if (user.profile.password != password){
              console.log(password);
              console.log(user.profile.password);
              return done(null, false, req.flash('loginMessage', 'Senha errada!'));
            }
            return done(null, user);
        });
    }));
};
