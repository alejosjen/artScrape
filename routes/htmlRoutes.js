var db = require("../models");

module.exports = function(app) {
// Routes

// A GET route for scraping the art newspaper website
app.get("/scrape", function (req, res) {

    //   First, we grab the body of the html with axios
    axios.get("https://www.theartnewspaper.com/news").then(function (response) {
      // Then, we load that into cheerio and save it to $ for a shorthand selector
      const $ = cheerio.load(response.data);
      const results = [];
      // Now, we grab every div tag with article-preview class, and do the following:
      $("div.article-preview").each(function (i, element) {
        // Save an empty result object
        const title = $(element).children("a").text();
        const scrapedLink = $(element).children("a").attr("href");
        const excerpt = $(element).children("div.cp-details").children("p.cp-excerpt").text();
        const link = `https://www.theartnewspaper.com${scrapedLink}`;
        result = {
          title: title,
          link: link,
          excerpt: excerpt
        };
        results.push(result);
        // console.log(results);
      });
  
      db.Article.insertMany(results)
        .then(function (dbArticle) {
          // View the added result in the console
          res.send("Scrape Complete");
          console.log("from server: " + dbArticle);
        })
        .catch(function (err) {
          // If an error occurred, log it
          res.status(500).send();
          console.log(err);
        });
    });
  });

app.get("/", function(request, response){
    response.render("index");
})
    
app.get("/articles", function(req, res) {
  // Grab every document in the Articles collection
  db.Article.find({})
    .then(function(dbArticle) {
      // If we were able to successfully find Articles, send them back to the client
    //   res.json(dbArticle);
      res.json(dbArticle);
    })
    .catch(function(err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});

// Route for grabbing a specific Article by id, populate it with its comment
app.get("/articles/:id", function(req, res) {
    // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
    db.Article.findOne({ _id: req.params.id })
      // ..and populate all of the commentss associated with it
      .populate("comment")
      .then(function(dbArticle) {
        // If we were able to successfully find an Article with the given id, send it back to the client
        res.json(dbArticle);
      })
      .catch(function(err) {
        // If an error occurred, send it to the client
        res.json(err);
      });
  });

  // Route for saving/updating an Article's associated Comment
app.post("/articles/:id", function(req, res) {
    // Create a new comment and pass the req.body to the entry
    db.Comment.create(req.body)
      .then(function(dbComment) {
        // If a Comment was created successfully, find one Article with an `_id` equal to `req.params.id`. Update the Article to be associated with the new Note
        // { new: true } tells the query that we want it to return the updated User -- it returns the original by default
        // Since our mongoose query returns a promise, we can chain another `.then` which receives the result of the query
        return db.Article.findOneAndUpdate({ _id: req.params.id }, { comment: dbComment._id }, { new: true });
      })
      .then(function(dbArticle) {
        // If we were able to successfully update an Article, send it back to the client
        res.json(dbArticle);
      })
      .catch(function(err) {
        // If an error occurred, send it to the client
        res.json(err);
      });
  });
};