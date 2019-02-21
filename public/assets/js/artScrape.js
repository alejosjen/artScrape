// Article List
const articleList = [];

// Grab the articles as a json
document.addEventListener('DOMContentLoaded', function () {
    function clear() {
        $("#articles").empty();
    }

    clear();

    $(document).on("click", "#searchArticles", function () {
        $.getJSON("/articles", function (data) {
            $("#articles").empty();
            //Check for duplicates
            const articleTitle = data.title;
            if (articleList.indexOf(articleTitle) === -1) {
                articleList.push(articleTitle);
            }

            data.forEach(function (data, index) {
                const ID = data._id;
                const title = data.title;
                const excerpt = data.excerpt;
                const articleLink = data.link;
                const articleResult = $(`
                <p data-id="${ID}"> 
                        ${title}
                        Excerpt: ${excerpt}
                        <a href="https://www.theartnewspaper.com${articleLink}">
                        (Link to view full article)
                        </a>
                    </p>
                    <button type="submit" id="save-article">Save</button>
                <div class="text-center">-----------------------------------</div>
            `)

                articleResult.appendTo("#articles");
            });
        })

    });
});

// Whenever someone clicks a p tag
$(document).on("click", "p", function () {

    // Save the id from the p tag
    let thisId = $(this).attr("data-id");

    // Now make an ajax call for the Article
    $.ajax({
        method: "GET",
        url: "/articles/" + thisId
    })
        // With that done, add the comment information to the page
        .then(function (data) {
            console.log(data);

            //MODAL AREA
            $("#title-input").text(data.title);
            //Look for this id, check for the attribute, replace it with our data
            $("#save-comment").attr("data-id", data._id);
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
        url: "/articles/" + thisId,
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
            // Empty the notes section
            // $("#comments").empty();
        });

    // Also, remove the values entered in the input and textarea for comment entry
    $("#title-input").val("");
    $("#body-input").val("");
});

// When you click on the save button, post article to the /saved page
$(document).on("click", "#save-article", function() {
    let thisId = $(this).attr("data-id"); 
    $.ajax({
        method: "POST",
        url: "/saved" + thisId,
    })
});
