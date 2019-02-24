// Article List
const articleList = [];

// Grab the articles as a json
document.addEventListener('DOMContentLoaded', function () {
    function clear() {
        $("#articles").empty();
    }

    clear();

    $(document).on("click", "#searchArticles", function () {
        console.log("Loading...")
        $.get("/api/scrape")
            .then(function (data) {
                console.log(data);
                console.log("Finished loading.")
                $.getJSON("/articles", function (data) {
                    $("#articles").empty();

                    data.forEach(function (data, index) {
                        const ID = data._id;
                        const title = data.title;
                        const excerpt = data.excerpt;
                        const articleLink = data.link;
                        const articleResult = $(`
                      <p> 
                        ${title}
                        Excerpt: ${excerpt}
                        <a href="https://www.theartnewspaper.com${articleLink}">
                        (Link to view full article)
                        </a>
                    </p>
                    <button class="change-saved" data-id="${ID}">Save</button>
                <div class="text-center">-----------------------------------</div>
            `)

                        articleResult.appendTo("#articles");
                    });
                })
            })
            .catch(function (error) {
                if (error) console.log("Error getting articles")
                // $("#div-id").text("Error getting articles");
            })
    });

    // Whenever someone clicks a comment button
    $(document).on("click", ".comment-button", function () {

        // Save the id from the button
        let thisId = $(this).attr("data-id");

        // Now make an ajax call for the Article
        $.ajax({
            method: "GET",
            url: "/api/articles/" + thisId
        })
            // With that done, add the comment information to the page
            .then(function (data) {
                console.log(data);

                //MODAL AREA
                $("#title-input").text(data.title);
                //Look for this id, check for the attribute, replace it with our data
                $("#save-comment").attr("data-id", data._id);
                $("#delete-comment").attr("data-id", data._id);
                //Run the modal
                $("#commentModal").modal();

                // If there's a comment in the article
                if (data.comment) {
                    // Place the body of the comment in the body textarea
                    $("#body-input").val(data.comment.body);
                }
            });
    });

    // When you click the save-comment button
    $(document).on("click", "#save-comment", function () {
        // Grab the id associated with the article from the submit button
        let thisId = $(this).attr("data-id");

        // Run a POST request to change the comment, using what's entered in the inputs
        $.ajax({
            method: "POST",
            url: "/api/articles/" + thisId,
            data: {
                // Value taken from title input
                title: $("#title-input").val(),
                // Value taken from comment textarea
                body: $("#body-input").val()
            }
        })
            // With that done
            .then(function (data) {
                // Log the response
                console.log(data);
            });

        // Also, remove the values entered in the input and textarea for comment entry
        $("#title-input").val("");
        $("#body-input").val("");
    });

    // When you click on the save button, patch article as saved
    $(document).on("click", ".change-saved", function () {
        let thisId = $(this).attr("data-id");
        // console.log(thisId);
        $.ajax({
            method: "PATCH",
            url: "/api/articles/" + thisId,
        })
            // With that done
            .then(function (data) {
                $(data._id).appendTo("#saved-articles");
                // Log the response
                console.log(data);
            });
    });

    $(document).on("click", "#viewSavedArticles", function () {
        // $('html, body').animate({
        //     scrollTop: $("#saved-articles").offset().top
        // }, 1000);
        $.get("/api/saved")
            .then(function (data) {
                data.forEach(function (data) {
                    console.log(data);
                    const ID = data._id;
                    const title = data.title;
                    const excerpt = data.excerpt;
                    const articleLink = data.link;
                    const articleResult = $(`
                      <div class="savedArticle">
                            <p>
                               ${title}
                                Excerpt: ${excerpt}
                                <a href="https://www.theartnewspaper.com${articleLink}">
                                (Link to view full article)
                                </a>
                            </p>
                    </div>
                    
                    <button class="comment-button" data-id="${ID}">Comment</button>
                    <button class="delete-article" data-id=${ID}>Delete Article</button>
	                
                    <div class="text-center">-----------------------------------</div>
            `)

                    articleResult.appendTo("#saved-articles");
                });

            })
    });


    $(document).on("click", "#delete-comment", function () {
        let thisId = $(this).attr("data-id");
        console.log("delete?" + thisId);
        $.ajax({
            method: "DELETE",
            url: "/api/articles" / + thisId,
        })
            // With that done
            .then(function (data) {
                $("#body-input").empty();
                // Log the response
                console.log(data);
            });
    })
});