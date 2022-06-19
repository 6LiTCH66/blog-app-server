require("dotenv").config();
const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
    if (req.method === "OPTIONS"){
        return next();
    }

    try {
        const token = req.cookies.token;

        if (!token){
            return res.status(401).json({message: "The token is required"})
        }
        req.user = jwt.verify(token, process.env.ACCESS_TOKEN)

    }catch (e){
        res.status(401).json({message: "The token is required"})
    }

    return next()
}