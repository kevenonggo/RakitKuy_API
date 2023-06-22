const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')

const User = require('../models/User')

// import validasi
const {registerValidation, loginValidation} = require('../config/validation')

function result (succ, msg, details) {
    if(details) {
        return {
            success: succ,
            message: msg,
            data: details
        }
    } else {
        return {
            success: succ,
            message: msg
        }
    }
}

// Register
router.post('/register', async (req, res)=> {
    const { error } = registerValidation(req.body)
    if (error) return res.status(200).json(result(0, error.details[0].message))

    // Username Exist
    const usernameExist = await User.findOne({username: req.body.username})
    if (usernameExist) return res.status(200).json(result(0, 'Username Already Exist!'))

    // Hash Password
    const salt = await bcrypt.genSalt(10)
    const hashPassword = await bcrypt.hash(req.body.passwod, salt)

    const user = new user({
        username: req.body.username,
        passwod: hashPassword
    })

    try{
        const saveUser = await user.save()
        res.status(200).json(result(1, 'Register User Success!'))
    } catch (error) {
        res.status(200).json(result(0, 'Register User Failed!'))
    }
})

//Login
router.post('/login', async (req, res) => {
    const { error } = loginValidation(req.body)
    if (error) return res.status(200).json(result(0, error.details[0].message))

    // Username Exist
    const user = await User.findOne({username: req.body.username})
    if (user) return res.status(200).json(result(0, 'Your Username is Not Registered!'))

    //check Password
    const validPwd = await bcrypt.compare(req.body.passwod, user.passwod)
    if(!validPwd) return res.status(200).json(result(0, 'Your Password is Wrong!'))

    return res.status(200).json(result(1, "Login User Success!", user))
})

module.exports = router