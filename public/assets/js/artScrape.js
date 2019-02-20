// Grab the articles as a json
$.getJSON("/articles", function(data) {
    
// $.getJSON("/articles", function (data) {
//     // For each one
//     console.log("test1: " + data);
//     const articles = [data];
    
//     articles.forEach(article => {
//         $("#articles").append(`
//         <p data-id="${article._id}"> 
//           <a href="https://www.theartnewspaper.com${article.link}">
//           ${article.title}
//           </a>
//         <br />
//         ${article.excerpt}
//         </p>
//         `);
//     });
//     console.log("test: " + articles);

// });
    for (var i = 0; i < data.length; i++) {
      // Display the apropos information on the page
      $("#articles").append(`
      <p data-id="${data[i]._id}"> 
        <a href="https://www.theartnewspaper.com${data[i].link}">
        ${data[i].title}
        </a>
      <br />
      ${data[i].excerpt}
      </p>
      `);
  };
});

// Whenever someone clicks a p tag
$(document).on("click", "p", function () {
    // Empty the comments from the comment section
    $("#comments").empty();
    // Save the id from the p tag
    const thisId = $(this).attr("data-id");
    console.log("test2: " + thisId);
    // Now make an ajax call for the Article
    $.ajax({
        method: "GET",
        url: "/articles/" + thisId
    })
        // With that done, add the comment information to the page
        .then(function (data) {
            console.log(data);
            // The title of the article
            // An input to enter a new title
            // A textarea to add a new comment body
            // A button to submit a new comment, with the id of the article saved to it
            
            //MODAL AREA INSTEAD
            $("#comments").append(`
                <h2>${data.title}</h2>
                <input id='title-input' name='title' >
                <textarea id='body-input' name='body'></textarea>
                <button data-id=${data._id} id='save-comment'>Save Comment</button>
                `);

            // If there's a comment in the article
            if (data.comment) {
                // Place the title of the comment in the title input
                $("#title-input").val(data.comment.title);
                // Place the body of the comment in the body textarea
                $("#body-input").val(data.comment.body);
            }
        });
});
 
// When you click the save-comment button
$(document).on("click", "#save-comment", function() {
    // Grab the id associated with the article from the submit button
    var thisId = $(this).attr("data-id");
  
    // Run a POST request to change the note, using what's entered in the inputs
    $.ajax({
      method: "POST",
      url: "/articles/" + thisId,
      data: {
        // Value taken from title input
        title: $("#title-input").val(),
        // Value taken from note textarea
        body: $("#body-input").val()
      }
    })
      // With that done
      .then(function(data) {
        // Log the response
        console.log(data);
        // Empty the notes section
        $("#comments").empty();
      });
  
    // Also, remove the values entered in the input and textarea for note entry
    $("#title-input").val("");
    $("#body-input").val("");
  });
  