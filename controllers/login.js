const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const User = require('../models/user')
const loginRouter = require('express').Router()
const config = require('../utils/config')

loginRouter.post('/', async (req, res) => {
    const { username, password } = req.body

    const user = await User.findOne({ username });
    const passwordCorrect = user === null
    ? false
    : await bcrypt.compare(password, user.passwordHash)

    if(!(user && passwordCorrect)) {
        return res.status(401).json({
            error: 'invalid username or password'
        })
    }

    // Payload
    const userForToken = {
        username: user.username,
        id: user._id
    }

    const expiredToken = { expiresIn: 60*60 }
    const token = jwt.sign(userForToken, config.JWT_SECRET, expiredToken)

    res
        .status(200)
        .send({ token, username: user.username, name: user.name })
})

module.exports = loginRouter