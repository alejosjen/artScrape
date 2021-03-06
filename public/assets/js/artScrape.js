// Article List
const articleList = [];

// Grab the articles as a json
document.addEventListener('DOMContentLoaded', function () {
    function clear() {
        $("#articles").empty();
    }

    clear();

    $(document).on("click", "#searchArticles", function () {
        $(".spinner-border").toggle();
        console.log("Loading...")
        $.get("/api/scrape")
            .then(function (data) {
                console.log(data);
                $(".spinner-border").toggle();
                console.log("Finished loading.")
                $.getJSON("/api/articles", function (data) {
                    $("#articles").empty();

                    data.forEach(function (data, index) {
                        let ID = data._id;
                        let title = data.title;
                        let excerpt = data.excerpt;
                        let articleImage = data.image;
                        let articleLink = data.link;
                        let articleResult = $(`
                        <div class="card" style="width: 18rem;">
                            <img src="${articleImage}" class="card-img-top" alt="article image">
                            <div class="card-body">
                                <h5 class="card-title">${title}</h5>
                                <h6 class="card-subtitle mb-2 text-muted">
                                    <a href=${articleLink} target="_blank">
                                     (Link to view full article)
                                    </a>
                                </h6>
                                <p class="card-text">${excerpt}</p>
                                <button type="button" class="card-link change-saved btn btn-info" data-id="${ID}">
                                 Save
                                </button>
                            </div>
                      </div>`)
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
                $(".save-comment").attr("data-id", data._id);
                //Run the modal
                $("#commentModal").modal();

                // If there's a comment in the article
                if (data.comment) {
                    // data.comment.forEach(function(comment){
                        //Make space to add multiple divs to hold multiple comments

                    // })
                    $(".delete-comment").attr("data-id", data.comment._id);
                    // Place the body of the comment in the body textarea
                    $("#body-input").val(data.comment.body);
                }
            });
    });

    // When you click the save-comment button
    $(document).on("click", ".save-comment", function () {
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
        $(this).parents(".card").remove();
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
        $("#saved-articles").empty();
        $.get("/api/saved")
            .then(function (data) {
                data.forEach(function (data, index) {
                    let ID = data._id;
                    let title = data.title;
                    let excerpt = data.excerpt;
                    let articleImage = data.image;
                    let articleLink = data.link;
                    let articleResult = $(`
                        <div class="card" style="width: 18rem;">
                        <img src="${articleImage}" class="card-img-top" alt="article image">
                            <div class="card-body">
                                <h5 class="card-title">${title}</h5>
                                <h6 class="card-subtitle mb-2 text-muted">
                                    <a href=${articleLink} target="_blank">
                                    (Link to view full article)
                                    </a>
                                </h6>
                                <p class="card-text">${excerpt}</p>
            
                                <button type="button" class="card-link comment-button btn btn-info" data-id="${ID}">Comment</button>
                                <button type="button" class="card-link delete-article btn btn-info" data-id=${ID}>Delete Article</button>
                            </div>
                        </div>`)
                    articleResult.appendTo("#saved-articles");
                });
            })
    });


    $(document).on("click", ".delete-comment", function () {
        let deleteComment = $(this).data("id");
        console.log(deleteComment);
        $.ajax({
            method: "DELETE",
            url: "/api/comments/" + deleteComment,
        })
            .then(function (data) {
                console.log("testing");
                $("#body-input").val("");
                // Log the response
                console.log(data);
            })
            .catch(function (error) {
                if (error) console.log("Error deleting comment.")
            });
    });

    $(document).on("click", ".delete-article", function () {
        let articleDelete = $(this).data("id");
        // console.log(articleDelete);
        $(this).parents(".card").remove();
        $.ajax({
            method: "DELETE",
            url: "/api/articles/" + articleDelete,
        })
            .then(function (data) {
                // Log the response
                console.log(data);
            })
            .catch(function (error) {
                if (error) console.log("Error deleting article.")
            });
    })
});