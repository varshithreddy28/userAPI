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

app.use(express.static(path.join(__dirname, '/utilities')))
app.use(express.static(path.join(__dirname, '/joiSchema')))

const catchError = require('./utilities/catchError')
const appError = require('./utilities/expressError')

// SCHEMA
const user = require('./routes/user')
const email = require('./routes/email')

app.use('/user', user)
app.use('/sendmail', email)

app.all('*', (req, res, next) => {
    next(new appError("Invalid URL", 404))
})

app.use((err, req, res, next) => {
    const { message = "Something went wrong please try again after some time!", status = 500 } = err //if no status code then it will set to 500 by default
    const msg = err.message.replace(/["]/g, '');
    res.json({ success: false, message: `${msg}` })
})

app.listen(3000, (req, res) => {
    console.log("Connected to port 3000")
})