const nodemailer = require("nodemailer");

module.exports.sendMail = async (
    destMail,
    subject,
    html,
    srcMail = "lenguyennhutnam91@gmail.com"
) => {
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: srcMail,
            pass: "qcuk anor rrtb ntsy",
        },
    });
    const mailOptions = {
        from: srcMail,
        to: destMail,
        subject: subject,
        html: html,
    };
    return transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            return false;
        } else {
            return true;
        }
    });
};
