var users = require('../models/userSchema');

module.exports = function(app, passport) {
  // Rotas estáticas =====================

  // =====================================
  // HOME PAGE ===========================
  // =====================================
  app.get('/', function(req, res) {
      res.render('../dist/views/login/login.ejs', {
        message: req.flash('loginMessage')
      });
  });

  // =====================================
  // LOGIN ===============================
  // =====================================
  app.get('/login', function(req, res) {
      // render the page and pass in any flash data if it exists
      res.render('../dist/views/login/login.ejs', {
        message: req.flash('loginMessage')
      });
  });

  // =====================================
  // SIGNUP ==============================
  // =====================================
  // show the signup form
  app.get('/signup', function(req, res) {
      // render the page and pass in any flash data if it exists
      res.render('../dist/views/login/signup.ejs', {
        message: req.flash('signupMessage')
      });
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
      failureRedirect : '/login', // redirect back to the signup page if there is an error
      failureFlash : true // allow flash messages
  }));

  // =====================================
  // Processa registro ===================
  // =====================================
  app.post('/signup', passport.authenticate('local-signup', {
     successRedirect : '/login', // redirect to the secure profile section
     failureRedirect : '/signup', // redirect back to the signup page if there is an error
     failureFlash : true // allow flash messages
  }));

  // =====================================
  // APÓS LOGIN ==========================
  // =====================================
  app.get('/main', isLoggedIn, function(req, res) {
      res.render('../dist/index.ejs', {
          user : req.user // get the user out of session and pass to template
      });
  });

 };

 // route middleware to make sure a user is logged in
 function isLoggedIn(req, res, next) {
     // if user is authenticated in the session, carry on
     if (req.isAuthenticated())
         return next();
     // if they aren't redirect them to the home page
     res.redirect('/');
 }
