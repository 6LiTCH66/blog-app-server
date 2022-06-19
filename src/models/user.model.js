const mongoose = require("mongoose")
const {Schema, mongo} = require("mongoose");

const userSchema = mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    isAdmin: {
        type: Boolean,
    },
    postId: [{
        type: Schema.Types.ObjectId,
        ref: 'Post'
    }]
});
module.exports = mongoose.model("User", userSchema)