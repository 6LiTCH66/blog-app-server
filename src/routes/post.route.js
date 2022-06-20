const Auth = require("../middlewares/auth.middleware.js")

module.exports = (app) => {
    const Post = require("../controllers/post.controller.js")

    app.get("/get-all", Post.getAllPosts)
    app.post("/create", Auth, Post.createPost)
    // app.get("/post/:postId",Auth,  Post.getOnePost)
    app.delete("/post/:postId", Auth,  Post.deletePost)
    app.put("/post/:postId", Auth, Post.updatePost)
    app.get("/user-post/:userId", Auth, Post.getUsersPosts)
}