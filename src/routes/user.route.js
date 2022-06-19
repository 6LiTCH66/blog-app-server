const {check} = require("express-validator")
const Auth = require("../middlewares/auth.middleware.js")
module.exports = (app) => {
    const User = require("../controllers/user.controller.js")
    app.post("/register",
        [
            check('email', 'Incorrect email address').isEmail(),
            check('password', "Minimum password length 6 characters").isLength({min: 6})
        ], User.registration)
    app.post('/login', User.login)
    app.post('/logout',Auth, User.logout)
    app.post('/token', Auth, User.create_new_token)
}