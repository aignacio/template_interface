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
          passwordField : 'passwd',
          passReqToCallback : true // allows us to pass back the entire request to the callback
      },
      function(req, username, password, done) {
          process.nextTick(function() {
            // console.log('DADOS ENVIADOS VIA POST: '+req.param('username'));
            User.findOne({ 'profile.username' : req.param('username') }, function(err, user) {
                if (err){
                  console.log('Ocorreu erro ao registrar usuário no banco!');
                  return done(null, false, req.flash('signupMessage', 'Erro ao registrar usuário no banco!'));
                  // return done(err);
                }

                if (user) {
                    console.log('Usuário: '+req.param('username')+' já está cadastrado no sistema!');
                    return done(null, false, req.flash('signupMessage', 'Usuário já existe'));
                }
                else {
                    var newUser            = new User();

                    newUser.profile.username    = req.param('username');
                    newUser.profile.password    = req.param('passwd');
                    newUser.profile.name        = req.param('name');
                    newUser.profile.mail        = req.param('email');
                    newUser.profile.admin       = req.param('admin');
                    newUser.profile.phone       = req.param('phone');

                    newUser.save(function(err) {
                        if (err)
                            throw err;
                        console.log('Salvando no banco de dados: '+req.param('username')+'...');
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
        passwordField : 'passwd',
        passReqToCallback : true
    },
    function(req, username, password, done) {
        User.findOne({"$or": [{ 'profile.username' :  req.param('username')},
                             {'profile.mail' :  req.param('username')  }]}, function(err, user) {
            if (err)
                return done(err);

            if (!user)
                return done(null, false, req.flash('loginMessage', 'Usuário não encontrado!'));

            if (user.profile.password != req.param('passwd')){
              // console.log(password);
              // console.log(user.profile.password);
              return done(null, false, req.flash('loginMessage', 'Senha errada!'));
            }
            return done(null, user);
        });
    }));
};
