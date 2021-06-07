const express = require('express')
const router = express.Router()

const userSchema = require('../joiSchema/user')

const catchError = require('../utilities/catchError')
const appError = require('../utilities/expressError')

// Schema
const User = require('../model/user')

const userValidate = (req, res, next) => {
    // special schema for Joi must be before mongoose code
    if (typeof (req.body.hobies) != 'object') {
        let hobies = req.body.hobies.split(',')
        req.body.hobies = hobies // convert hobies enter to array
    }
    req.body.mobileNumber = req.body.mobileNumber.toString()
    const body = {
        name: req.body.name,
        mobileNumber: req.body.mobileNumber,
        email: req.body.email,
        hobies: req.body.hobies
    }
    const { error } = userSchema.validate(body)
    if (error) {
        const msg = error.details.map(ele => ele.message).join(',')
        throw new appError(msg, 400)
    }
    else
        next()
}

router.get('/', catchError(async (req, res) => {
    const users = await User.find()
    if (users.length == 0)
        return res.json({ success: false, message: "No user in Data base!" })
    res.json({ success: true, message: users })
}))

router.post('/new', userValidate, catchError(async (req, res) => {
    const user = req.body
    const newUser = new User({ ...user })
    newUser.save()
    res.redirect('/user')
}))

router.get('/:id/edit', catchError(async (req, res) => {
    const user = await User.findById(req.params.id)
    res.json({ success: true, message: user })
}))

router.patch('/:id/edit', userValidate, catchError(async (req, res) => {
    await User.findByIdAndUpdate(req.params.id, { ...req.body })
    res.json({ success: true, message: "User Updated Successfully" })
}))

router.delete('/:id/delete', catchError(async (req, res) => {
    await User.findByIdAndDelete(req.params.id)
    res.json({ success: true, message: "User Deleted Successfully" })
}))


module.exports = router