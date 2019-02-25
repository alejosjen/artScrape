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
                        const ID = data._id;
                        const title = data.title;
                        const excerpt = data.excerpt;
                        const articleLink = data.link;
                        const articleResult = $(`
                        <div class="card" style="width: 18rem;">
                            <div class="card-body">
                                <h5 class="card-title">${title}</h5>
                                <h6 class="card-subtitle mb-2 text-muted">
                                    <a href="https://www.theartnewspaper.com${articleLink}">
                                     (Link to view full article)
                                    </a>
                                </h6>
                                <p class="card-text">${excerpt}</p>
                                <button type="button" class="card-link change-saved btn btn-success" data-id="${ID}">
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
                $(".delete-comment").attr("data-id", data._id);
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
                data.forEach(function (data, index) {
                    const ID = data._id;
                    const title = data.title;
                    const excerpt = data.excerpt;
                    const articleLink = data.link;
                    const articleResult = $(`
                        <div class="card" style="width: 18rem;">
                            <div class="card-body">
                                <h5 class="card-title">${title}</h5>
                                <h6 class="card-subtitle mb-2 text-muted">
                                    <a href="https://www.theartnewspaper.com${articleLink}">
                                    (Link to view full article)
                                    </a>
                                </h6>
                                <p class="card-text">${excerpt}</p>
            
                                <button type="button" class="card-link comment-button btn btn-success" data-id="${ID}">Comment</button>
                                <button type="button" class="card-link delete-article btn btn-success" data-id=${ID}>Delete Article</button>
                            </div>
                        </div>`)
                    articleResult.appendTo("#saved-articles");
                });
            })
    });


    $(document).on("click", ".delete-comment", function () {
        let commentDelete = $(this).data("id");
        console.log(commentDelete);
        ("#body-input").empty();
        $.ajax({
            method: "DELETE",
            url: "/api/articles/" + commentDelete,
        })
            .then(function (data) {
                // Log the response
                console.log(data);
            })
            .catch(function (error) {
                if (error) console.log("Error deleting comment.")
            });
    });
    //     let thisId = $(this).attr("data-id");
    //     console.log("delete?" + thisId);
    //     $.ajax({
    //         method: "DELETE",
    //         url: "/api/articles" / + thisId,
    //     })
    //         // With that done
    //         .then(function (data) {
    //             $("#body-input").empty();
    //             // Log the response
    //             console.log(data);
    //         })
    //         .catch(function (error) {
    //             if (error) console.log("Error deleting comment.")
    //         });
    // });

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