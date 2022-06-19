const mongoose = require("mongoose")
const {Schema} = require("mongoose");

const postSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    created_at: {
        type: Date,
        default: Date.now()
    },
    updated_at:{
        type: Date,
        default: Date.now()
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User"
    }

});
module.exports = mongoose.model("Post", postSchema)