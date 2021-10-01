//CLI: npm install nodemailer --save

var nodemailer = require('nodemailer');
var MyConstants = require("./MyConstants.js");
var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: MyConstants.EMAIL_USER,
    pass: MyConstants.EMAIL_PASS
  }
});
var EmailUtil = {
  
  send(email) {
    var text = 'Chao mung den voi website \n';
    text += 'Hello World';
    return new Promise(function (resolve, reject) {
      var mailOptions = {
        from: MyConstants.EMAIL_USER,
        to: email,
        subject: 'Signup | Verification',
        text: text
      };
      transporter.sendMail(mailOptions, function (err, result) {
        if (err) reject(err);
        resolve(true);
      });
    });
  }
};
module.exports = EmailUtil;