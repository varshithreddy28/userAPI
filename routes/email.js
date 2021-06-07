const express = require('express')
const { message } = require('../joiSchema/user')
const router = express.Router()
const ejs = require('ejs')
const nodemailer = require('nodemailer')

const userSchema = require('../joiSchema/user')

const catchError = require('../utilities/catchError')
const appError = require('../utilities/expressError')

router.post('/', catchError(async (req, res) => {
    const data = req.body
    const output = await ejs.renderFile("../email.ejs", { data: data });
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'varshithreddytest@gmail.com',
            pass: 'xxx'
        }
    });

    const mailOptions = {
        from: 'varshithreddytest@gmail.com',
        to: 'info@redpositive.in',
        subject: 'Sending Email using Node.js',
        text: `Hello,This is varshith Reddy from intershala this mail is from the assingment given`,
        html: output
    };
    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            new appError({ message: error.message })
        } else {
            res.json({ success: true, message: "Email Sent..." })
        }
    });
}))

module.exports = router
