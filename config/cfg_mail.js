var exports = module.exports = {};
var nodemailer  = require('nodemailer');
var mg          = require('nodemailer-mailgun-transport');
var User        = require('../models/userSchema');
var colors      = require('colors/safe');
var application = process.env.APPLICATION;
var phone_awges = process.env.PHONE_AWGES;

colors.setTheme({
  mail: 'yellow',
  warn: 'yellow',
  debug: 'blue',
  error: 'red'
});

var recoverMail = function(email, hash_recover){
  User.find({'profile.mail' : email},function(err,  users){
    var transporter = nodemailer.createTransport('smtps://awgeslightdna%40gmail.com:awges12345@smtp.gmail.com');
    var body_text,
        signature,
        data_email = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');

    body_text = 'Olá <b>'+users[0].profile.name+'</b>,<br>\
                 foi solicitado pelo sistema <b>'+application+'</b> a recuperação de senha\
                 para o seu e-mail cadastrado. O código para alteração de senha gerado é:<br><br>\
                 <b>'+hash_recover+'</b><br>';

    signature = '<br>\
                <b>Sistema '+application+' - Powered by AWGES<br><br><br></b>\
                <img src="http://www.awges.com/wp-content/uploads/2016/12/cropped-logo_awges_h-1.png" width="200px">\
                <br>Telefone:'+phone_awges;

    body_text += signature;

    var mailOptions = {
        from: 'Suporte AWGES <suporte@awges.com>', // sender address
        to: email, // list of receivers
        subject: 'Recuperação de conta ('+data_email+')', // Subject line
        text: '\
        AWGES',
        html: body_text
    };

    transporter.sendMail(mailOptions, function(error, info){
        if(error){
            console.log(colors.mail("[Mail - ERROR]")+' Erro ao envia e-mail: ' + error);
            //return console.log(error);
        }
        else {
          console.log(colors.mail("[Mail - SUCCESS]")+' E-mail enviado: ' + info.response);
        }
    });
  });
};

exports.recoverMail = recoverMail;
