require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser")

const app = express();
let PORT = process.env.PORT || 3030

mongoose.connect(process.env.MONGODB_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }).then(() => {
        console.log("Successfully connected to the database")
    }).catch(err => {
        console.log('Could not connect to the database. Error...', err)
        process.exit()
    })

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))
app.use(cookieParser())

require("./src/routes/user.route")(app)
require("./src/routes/post.route")(app)

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})

