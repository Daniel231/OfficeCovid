const nodemailer = require("nodemailer");
const config = require("../config/config");

const sendMail = (emails) => {
    const transporter = nodemailer.createTransport({
        host: config.mail.host,
        port: 587,
        auth: { user: config.mail.user, pass: config.mail.password },
        secure: false,
        tls: { ciphers: 'SSLv3' }
    });

    // send mail with defined transport object
    return transporter.sendMail({
        from: `"Montara" <${config.mail.user}>`,
        to: emails.join(),
        subject: "Corona virus alert",
        text: "Dear employee we deeply sorry to tell you that you were at work at the same time with another employee that now is sick with corona. please dont come to work, your fired!! ",
    })
}

module.exports = {
    sendMail
}