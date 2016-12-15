// Inicializa variáveis de ambiente para configurar a aplicação
// var sys = require('sys')
// var exec = require('child_process').exec;
// function puts(error, stdout, stderr) { sys.puts(stdout) }
// exec("sh ./export_env.sh", puts);

var express        = require('express');
var app            = express();
var bodyParser     = require('body-parser');
var methodOverride = require('method-override');
var colors         = require('colors');
var path           = require('path');
var passport       = require('passport');
var flash          = require('connect-flash');
var morgan         = require('morgan');
var cookieParser   = require('cookie-parser');
var session        = require('express-session');
var db             = require('./config/db');
var DEBUG_MONGO    = 0;
var port           = process.env.PORT;
var application    = process.env.APPLICATION;
var Key            = require('./models/keyRegisterSchema');
var md5            = require('md5');

app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
// configuration ===============================================================

require('./config/passport')(passport); // pass passport for configuration

app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser()); // get information from html forms
app.set('view engine', 'ejs'); // set up ejs for templating

app.use(session({ secret: '3102230' })); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session
app.use(express.static(path.join(__dirname, 'dist')));

console.log(path.join(__dirname, 'dist'));
db(DEBUG_MONGO);

// routes ======================================================================
require('./backend/routes.js')(app, passport); // load our routes and pass in our app and fully configured passport


// Generate key register =======================================================
// for (var i = 0; i < 10; i++) {
//   var key                   = new Key();
//   var hash_value            = new Date();
//
//   hash_value                = hash_value+i*Math.random()+Math.random()*10;
//   key.key_register          = md5(hash_value);
//
//   key.save(function(err) {
//       if (err)
//           throw err;
//       // console.log('Chave de registro inserida:['+i+']['+key.key_register+']');
//   });
//   console.log('Chave ['+i+'] de acesso criada com sucesso!');
// }

Key.find({}, function(err, keys) {
    if (err)
        throw err;
    for (var i = 0; i < keys.length; i++)
      console.log('Chave=['+keys[i].key_register+']   Utilizada=['+keys[i].used+']');

});

// launch ======================================================================
app.listen(port);
console.log('['+application+'] Server listening on port:' + port);
