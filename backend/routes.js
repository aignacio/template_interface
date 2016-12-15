var User          = require('../models/userSchema');
var mail          = require('../config/cfg_mail');
var application   = process.env.APPLICATION;
var md5           = require('md5');

module.exports = function(app, passport) {
  // Rotas estáticas =====================
  // =====================================
  // HOME PAGE ===========================
  // =====================================
  app.get('/', function(req, res) {
    res.render('../dist/views/login/login.ejs', {
      message: req.flash('loginMessage'),
      nameApp: application
    });
  });

  // =====================================
  // INFO ABOUT APPLICATION ==============
  // =====================================
  app.get('/info/application', function(req, res) {
    res.send({'name':application});
  });

  // =====================================
  // LOGIN ===============================
  // =====================================
  app.get('/login', function(req, res) {
      // render the page and pass in any flash data if it exists
      res.render('../dist/views/login/login.ejs', {
        message: req.flash('loginMessage'),
        nameApp: application
      });
  });

  // =====================================
  // SIGNUP ==============================
  // =====================================
  app.get('/signup', function(req, res) {
      // render the page and pass in any flash data if it exists
      res.render('../dist/views/login/signup.ejs', {
        // message: req.flash('signupMessage')
      });
  });

  // =====================================
  // RECOVER =============================
  // =====================================
  app.get('/recover', function(req, res) {
      // render the page and pass in any flash data if it exists
      res.render('../dist/views/login/recover.ejs', {
        // message: req.flash('signupMessage')
      });
  });

  // =====================================
  // FAIL LOGIN ==========================
  // =====================================
  // show the signup form
  app.get('/login_fail', function(req, res) {
      res.send({'status':req.flash('loginMessage')});
  });

  // =====================================
  // FAIL SIGNUP =========================
  // =====================================
  // show the signup form
  app.get('/signup_fail', function(req, res) {
      res.send({'status':req.flash('signupMessage')});
  });

  // =====================================
  // LOGOUT ==============================
  // =====================================
  app.get('/logout', function(req, res) {
      req.logout();
      res.redirect('/');
  });

  // =====================================
  // Processa login ======================
  // =====================================
  app.post('/login', passport.authenticate('local-login', {
      successRedirect : '/main', // redirect to the secure profile section
      failureRedirect : '/login_fail', // redirect back to the signup page if there is an error
      failureFlash : true // allow flash messages
  }));

  // =====================================
  // Processa registro ===================
  // =====================================
  app.post('/signup', passport.authenticate('local-signup', {
     successRedirect : '/login', // redirect to the secure profile section
     failureRedirect : '/signup_fail', // redirect back to the signup page if there is an error
     failureFlash : true // allow flash messages
  }));

  // =====================================
  // Processa recover ====================
  // =====================================
  app.post('/recover',function(req,res){
    var email = req.body.email;
    User.update({'profile.mail': email}, {
        'profile.hash_recover': md5(email),
        'profile.updated': new Date()
    },function (err, users) {
      if (err){
        console.log('Alteração de senha apresentou um problema!');
        res.send({'status':'fail','info':'Geração de hash apresentou um problema!'});
      }
      else{
        if (users.nModified == '1') {
              console.log("E-mail de recuperação cadastrado!");
              res.send({'status':'success','info':'Verifique sua caixa de entrada'});
              mail.mailSend(email);
        }
        else {
          console.log("E-mail de recuperação não cadastrado!");
          res.send({'status':'fail','info':'e-mail não cadastrado no sistema'});
        }
      }
    });
  });

  // =====================================
  // APÓS LOGIN ==========================
  // =====================================
  app.get('/main', isLoggedIn, function(req, res) {
      res.render('../dist/index.ejs', {
          user : req.user // get the user out of session and pass to template
      });
  });
};

function isLoggedIn(req, res, next) {
  // if user is authenticated in the session, carry on
  if (req.isAuthenticated())
    return next();
  // if they aren't redirect them to the home page
  res.redirect('/');
}
