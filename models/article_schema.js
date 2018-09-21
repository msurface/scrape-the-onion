//ArticlePost

// requiring in mongoose dependency
const mongoose = require("mongoose");

// creating a Schema constructor
const Schema = mongoose.Schema;

// using Schema constructor to create a new Schema
const ArticleSchema = new Schema({
    // "title" is required and its a string
    title: {
        type: String,
        required: true
    },
    // link is required and type of String
    link: {
        type: String,
        required: true
    },
    // summary is a string, not required
    summary: {
        type: String
    }
});

// now create the model from the above schema. Use mongoose's model method
const ArticlePost = mongoose.model("ArticlePost", ArticleSchema);

// export the ArtcilePost model
module.exports = ArticlePost;
