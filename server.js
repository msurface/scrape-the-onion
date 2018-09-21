// Dependencies
const express = require("express");
const bodyParser = require("body-parser");
const logger = require("morgan");
const mongoose = require("mongoose");

// Scrapping tools
// Axios is like jQuery's Ajax method
const axios = require("axios");
// cheerio is my scrapper
const cheerio = require("cheerio");

// setting db to require all models
const db = require("./models");

// setting up our server with express
// initilizing express
const app = express();

// setting up the port for heroku and to be used locally
const PORT = process.env.PORT || 2000;

// configuring middleware
// user morgan logger for logging requests
app.use(logger("dev"));

// sets up the express app to handle data parsing
app.use(bodyParser.urlencoded({extended: true}));
app.user(bodyParser.json());

// use express.static to serve the public folder as a static directory
app.use(express.static("public"));

// connecting to mongodb
mongoose.connect("mongodb://localhost/scrapper");

// creating a GET route to scrape The Onion
app.get("/scrape", function(req, res) {
    
    // grab the body of the html with a request
    axios.get("https://www.theonion.com/").then(function(response) {
        // load this into cheerio and sve it to $ for a shorthand selector
        const $ = cheerio.load(response.data);
        // now grab every acticle with a h2 tag within an article tag
        $("article h1").each(function(i, element) {
            // save in an empty result object
            let result = {};
            // add the text and the href of every link, and save them as properties of the result obj
            result.title = $(this)
              .children("a")
              .text();
            result.link = $(this)
              .children("a")
              .attr("href");
            result.summary = $(this)
              .parent.parent//use selector to grab the p
            // create a new ArticlePost using the result object built from scraping
            db.ArticlePost.create(result)
                .then(function(dbArticlePost) {
                    // view the added result in the console
                    console.log(dbArticlePost);
                })
                .catch(function(err) {
                    // if an error occurs, send it to the client
                    return res.json(err);
                });
        });
        // if we were able to seccessfully scrape and save an Article, send a message to the client
        res.send("Scrape Completed");
    });
});

// Route for getting all articles from the db
app.get("/articles", function(req, res) {
    db.ArticlePost.find({})
    .then(function(dbArticles) {
        // if finding articles is a success, send them to the client
        res.json(dbArticles);
    })
    .catch(function(err) {
        // if error sending it to the client
        res.json(err);
    });
});

// Route to grab a specific Article by id, populate it 
app.get("/articles/:id", function(req, res) {
    // prepare a query to find the article associated to the matching id in our db
    db.ArticlePost.findOne({ _id: req.params.id})
    .populate("comment")
    .then(function(dbArticles) {
        // send to the client if found
        res.json(dbArticles);
    })
    .catch(function(err) {
        // if error send it to the client
        res.json(err);
    });
});

// route to save/update an article's associated Comment
app.post("/articles/:id", function(req, res) {
    // creating a new comment and psass the req.body to the entry
    db.Comment.create(req.body)
    .then(function(dbComment) {
        return db.ArticlePost.findOneAndUpdate({_id: req.params.id}, {comment: dbComment._id}, {new: true});
    })
    .then(function(dbArticles) {
        // if we update succesfully send it to the client
        res.json(dbArticles);
    })
    .catch(function(err) {
        // if error send it to the client
        res.json(err);
    });
});

// Starting the server
app.listen(PORT, function() {
    console.log(`App running on ${PORT}!`)
});




