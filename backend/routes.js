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
  // CHANGE PASS =========================
  // =====================================
  app.get('/pass_rec', function(req, res) {
      // render the page and pass in any flash data if it exists
      res.render('../dist/views/login/change_pass.ejs', {
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
    var email = req.body.email,
        hash_recover = md5(email+new Date());
    User.update({'profile.mail': email}, {
        'profile.hash_recover': hash_recover,
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
              mail.recoverMail(email, hash_recover);
        }
        else {
          console.log("E-mail de recuperação não cadastrado!");
          res.send({'status':'fail','info':'e-mail não cadastrado no sistema'});
        }
      }
    });
  });

  // =====================================
  // Processa change_pass (troca de senha)
  // =====================================
  app.post('/change_pass',function(req,res){
    var hash_verf = req.body.hash_verf,
        password = req.body.passwd;

    User.update({'profile.hash_recover': hash_verf}, {
        'profile.password': password,
        'profile.updated': new Date()
    },function (err, users) {
      if (err){
        console.log('Alteração de senha apresentou um problema!');
        res.send({'status':'fail','info':'Geração de hash apresentou um problema!'});
      }
      else{
        if (users.nModified == '1') {
              console.log("Senha alterada com sucesso!");
              res.send({'status':'success','info':'Senha alterada com sucesso'});
        }
        else {
          console.log("Código hash informado: "+hash_verf+" não confere");
          res.send({'status':'fail','info':'Código informado não existe'});
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

  // app.error(function(err, req, res, next){
  //     if (err instanceof NotFound) {
  //         res.render('../dist/views/login/not_found.ejs');
  //     } else {
  //         next(err);
  //     }
  // });
  app.use(function(req, res, next) {
    res.status(404).render('../dist/views/login/not_found.ejs');
  });
};

function isLoggedIn(req, res, next) {
  // if user is authenticated in the session, carry on
  if (req.isAuthenticated())
    return next();
  // if they aren't redirect them to the home page
  res.redirect('/');
}
