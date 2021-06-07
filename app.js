require('dotenv/config') //envfile

const express = require('express')
const app = express()
const path = require('path')

const cors = require('cors')
const joi = require('joi')
const nodemailer = require('nodemailer');
const ejs = require('ejs')

app.use(cors())

const mongoose = require('mongoose')

const uri = process.env.MONGO_URL
mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
})
    .then(() => {
        console.log("Connected to DB!")
    })
    .catch((error) => {
        console.log("Error in connecting to database!")
        // res.json({message:"Error in connecting to database!",success:false})
    })

app.use(express.json());
app.use(express.urlencoded({ extended: true }))

app.set('view engine', 'ejs')

app.use(express.static(path.join(__dirname, '/utilities')))
app.use(express.static(path.join(__dirname, '/views')))
app.use(express.static(path.join(__dirname, '/joiSchema')))

const catchError = require('./utilities/catchError')
const appError = require('./utilities/expressError')

// SCHEMA
const user = require('./routes/user')

app.use('/user', user)
app.post('/sendmail', catchError(async (req, res) => {
    const data = req.body
    const output = await ejs.renderFile(__dirname + "/email.ejs", { data: data });
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'varshithreddytest@gmail.com',
            pass: 'varshithtest'
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

app.all('*', (req, res, next) => {
    next(new appError("Invalid URL", 404))
})

app.use((err, req, res, next) => {
    const { message = "Something went wrong please try again after some time!", status = 500 } = err //if no status code then it will set to 500 by default
    const msg = err.message.replace(/["]/g, '');
    res.json({ success: false, message: `${msg}` })
})

const port = process.env.PORT || 3000
app.listen(port, (req, res) => {
    console.log("Connected to port 3000")
})