const nodemailer = require('nodemailer');
require('dotenv').config();

const { UKR_NET_PASSWORD, UKR_NET_EMAIL } = process.env;

const nodemailerConfig = {
    host: 'smtp.ukr.net',
    port: 465,
    secure: true,
    auth: {
        user: UKR_NET_EMAIL,
        pass: UKR_NET_PASSWORD,
    }
};

const transport = nodemailer.createTransport(nodemailerConfig);

// const data = {
//     to: 'xosepo8388@soebing.com',
//     subject: 'Test email',
//     html: '<strong>Test email</strong>'
// };

// transport.sendMail(email)
//     .then(() => console.log("Email sent"))
//     .catch(error => console.log(error.message))

const sendEmail = (data) => { 
    const email = { ...data, from: UKR_NET_EMAIL };
    return transport.sendMail(email)
}

module.exports = sendEmail;