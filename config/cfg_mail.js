var exports = module.exports = {};
var nodemailer  = require('nodemailer');
var mg          = require('nodemailer-mailgun-transport');
var User        = require('../models/userSchema');
var colors      = require('colors/safe');

colors.setTheme({
  mail: 'yellow',
  warn: 'yellow',
  debug: 'blue',
  error: 'red'
});

var mailSend = function(email){
  User.find({'profile.mail' : email},function(err,  users){
    var transporter = nodemailer.createTransport('smtps://awgeslightdna%40gmail.com:awges12345@smtp.gmail.com');
    var body_text,
        signature;

    body_text = 'Olá,<br>\
                 Teste';

    signature = '<br>\
                AWGES Sistemas<br>\
                <img src="http://www.awges.com/wp-content/uploads/2016/12/cropped-logo_awges_h-1.png" width="200px"></div>';

    body_text += 'teste';
    body_text += signature;

    var mailOptions = {
        from: 'Suporte AWGES <suporte@awges.com>', // sender address
        to: email, // list of receivers
        subject: 'Recuperação de conta -'+new Date(), // Subject line
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

exports.mailSend = mailSend;
