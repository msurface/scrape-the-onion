// require in mongoose dependency
const mongoose = require("mongoose");

// store a reference to the Schema constructor
const Schema = mongoose.Schema;

// creading a comment Schema using the Schema constructor
const CommentSchema = new Schema({
    // Comment title
    title: String,
    // body of comment -- the comment
    body: String
});

// create our model using the schema above
const Comment = mongoose.model("Comment", CommentSchema);

// Expore the Comment model
module.exports = Comment;

