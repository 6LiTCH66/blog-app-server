require("dotenv").config()
const Post = require("../models/post.model.js")
const User = require("../models/user.model.js")

const jwt = require('jsonwebtoken')
const mongoose = require("mongoose")
const e = require("express");
const {mongo} = require("mongoose");

exports.getAllPosts = (req, res) => {
    Post.find().then((data) => {
        res.json(data)
    }).catch((err) => {
        res.status(500)
            .json({message: err.message || "Some error occurred while retrieving posts."})
    })
}

exports.createPost = (req, res) => {
    const {title, description} = req.body;
    const token = req.cookies.token;
    const user = jwt.verify(token, process.env.ACCESS_TOKEN)

    const userId = mongoose.mongo.ObjectId(user.id)

    const post = new Post({
        title,
        description,
        userId
    })

    post.save().then((data) => {
        User.findByIdAndUpdate(userId, {
            $push: {postId: post._id}
        }, {
            new: true
        }).then(() => {
            res.status(201).json(data) // message: "Post was successfully created!"

        }).catch((err) => {
            res.status(500).json({message: err.message})
        })
    }).catch((err) => {
        res.status(500).json({message: err.message || "Some error occurred while creating the Post."})
    })

}

exports.getOnePost = (req, res) => {
    Post.findById(req.params.postId)
        .then((data) => {
            if (!data){
                return res.status(404).json({
                    message: "Post not found with id: " + req.params.postId,
                })
            }
            res.json(data)
        }).catch((err) => {
            if (err.kind === "ObjectId"){
                return res.status(404).json({
                    message: "Post not found with id: " + req.params.postId,
                });
            }

        return res.status(500).json({
            message: "Error retrieving post with id: " + req.params.postId
        });
    })
}

exports.deletePost = (req, res) => {
    const token = req.cookies.token;
    const user = jwt.verify(token, process.env.ACCESS_TOKEN)

    // looking for a post
    Post.findById(req.params.postId)
        .then((data) => {
            // if post is not found throw an error
            if (!data){
                return res.status(404).json({
                    message: "Post not found with id: " + req.params.postId,
                })
            }

            // if post found compare user's id from findById with user's id in jwt token
            if (data.userId.toString() === user.id){
                // if match find and remove post that you're looking for
                Post.findByIdAndRemove(req.params.postId)
                    .then((removed_data) => {

                        if (!removed_data){
                            return res.status(404).json({
                                message: "Post not found with id: " + req.params.postId,
                            })
                        }

                        // if post found delete the post and delete foreign key from user
                        User.updateOne(
                            {_id: data.userId}
                            , {$pull: {postId: req.params.postId}}).then(() => {

                                return res.status(200).json({message: "Post deleted successfully!"})

                        }).catch((err) => {

                            return res.status(500).json({message: err.message})

                        })

                    }).catch((err) => {
                        if (err.kind === "ObjectId"){
                            return res.status(404).json({
                                message: "Post not found with id: " + req.params.postId,
                            });
                        }

                        return res.status(500).json({
                            message: "Error retrieving post with id: " + req.params.postId
                        });
                    });
            }else{
                return res.status(405).json({message: "You are not allowed to delete this post!"})
            }

        }).catch((err) => {
            return res.status(500).json({message: "Error while deleting this post!"})
    })
}
exports.updatePost = (req, res) => {
    const token = req.cookies.token;
    const user = jwt.verify(token, process.env.ACCESS_TOKEN)

    Post.findById(req.params.postId)
        .then((data) => {
            if (!data){
                return res.status(404).json({
                    message: "Post not found with id: " + req.params.postId
                })
            }


            if (data.userId.toString() === user.id){
                Post.findByIdAndUpdate(req.params.postId,
                    {
                        title: req.body.title,
                        description: req.body.description,
                        updated_at: Date.now()
                    })
                    .then((data) => {
                        if (!data){
                            return res.status(404).json({message: "Post not found with id: " + req.params.postId})
                        }

                        res.status(200).json({message: "Post updated successfully!"})


                    }).catch((err) => {
                        if (err.kind === "ObjectId"){
                            return res.status(404).send({
                                message: "Post not found with id " + req.params.postId,
                            });
                        }
                        return res.status(500).send({
                            message: "Error retrieving message with id: " + req.params.postId
                        });

                })
            } else {
                return res.status(405).json({message: "You are not allowed to modify this post!"})
            }
        }).catch((err) => {
            if (err.kind === "ObjectId"){
                return res.status(404).send({
                    message: "Post not found with id " + req.params.postId,
                });
            }
            return res.status(500).send({
                message: "Error retrieving message with id: " + req.params.postId
            });
    })
}

exports.getUsersPosts = (req, res) => {

    Post.find({userId: req.params.userId})
        .then((data) => {
            if (!data){
                return res.status(404).json({message: "Post not found with id: " + req.params.userId})
            }
            res.status(200).json(data)

        }).catch((err) => {
            if (err.kind === "ObjectId"){
                return res.status(404).json({message: "Post not found with id: " + req.params.userId})
            }

            return res.status(500).json({message: err.message})
    })

}