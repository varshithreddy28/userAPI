const { string } = require('joi')
const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        require: true
    },
    email: {
        type: String,
        require: true
    },
    mobileNumber: {
        type: Number,
        require: true
    },
    hobies: [
        {
            type: String,
            require: true
        }
    ]
})

const User = mongoose.model('User', userSchema)

module.exports = User