require("dotenv").config()
const User = require("../models/user.model.js")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt");
const {validationResult} = require("express-validator");

exports.registration = (req, res) => {
    try {
        const errors = validationResult(req)

        if (!errors.isEmpty()){
            return res.status(400).json({error: errors.array(), message: "Incorrect data while registration"})
        }

        const {email, password, username, isAdmin} = req.body;

        User.findOne({email}, async (err, user) => {
            if (err) {
                return res.status(500).json({message: err.message})
            }

            if (user) {
                return res.status(400).json({message: "User already exist"})
            }

            const hashedPassword = await bcrypt.hash(password, 12)
            const new_user = new User({email, password: hashedPassword, username, isAdmin})

            await new_user.save().then(() => {
                res.status(201).json({message: "User was successfully created"})
            }).catch((err) => {
                res.status(500).json({message: err.message})
            })

        })

    } catch (e) {
        res.status(500).json({message: e.message})
    }

}
exports.login = (req, res) => {
    try{
        const errors = validationResult(res)
        if (!errors.isEmpty()){
            return res.status(400).json({error: errors.array(), message: "Incorrect data while Logging in"})
        }

        const {email, password, username} = req.body;

        User.findOne({email}, async (err, user) => {
            if (err) {
                return res.status(500).json({message: err.message})
            }

            if (!user) {
                return res.status(400).json({message: "User doesn't exist"})
            }

            const isMatch = await bcrypt.compare(password, user.password)

            if (!isMatch){
                return res.status(400).json({message: "Incorrect password, try again"})
            }


            const token = jwt.sign(
                {id: user._id, email, username},
                process.env.ACCESS_TOKEN,
                {
                    expiresIn: "1h"
                }
            )

            // secure true
            res.cookie("token", token, {
                httpOnly: true,
                // maxAge: 15 * 60 * 1000,
                overwrite: true,
                sameSite: "none",
                secure: false
            }).status(200).json({message: "You are logged in successfully!"})
        })


    }catch (e){
        res.status(500).json({message: e.message})
    }
}

exports.logout = (req, res) => {
    return res.clearCookie("token").status(200).json({message: "You are logged out successfully!"})
}

exports.create_new_token = (req, res) => {
    try{
        const token = req.cookies.token;
        const user = jwt.verify(token, process.env.ACCESS_TOKEN)

        const new_token = jwt.sign(
            {id: user._id, email: user.email, username: user.username},
            process.env.ACCESS_TOKEN,
            {
                expiresIn: "15m"
            }
        )

        res.cookie("token", new_token, {
            httpOnly: true,
            maxAge: 15 * 60 * 1000,
            overwrite: true,
            sameSite: "none",
            secure: false
        }).status(200).json({message: "Token was successfully updated!"})

    }catch (e){
        res.status(401).json({message: e.message})
    }
}