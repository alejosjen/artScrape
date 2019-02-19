// Grab the articles as a json
// $.getJSON("/articles", function(data) {
//     // For each one
//     const articles = data;
//     articles.forEach(article => $("#articles").append(`
//           <p data-id="${article._id}"> ${article.title}  
//           <br /> 
//           ${article.link}
//           <br />
//           ${article.excerpt}
//           </p>
//           `)
//     );
// });
$.getJSON("/articles", function(data) {
    // For each one
    // var articles = [];
    // data.forEach(function(result){
    //     console.log(result);
    // })
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
$(document).on("click", "p", function() {
    // Empty the notes from the note section
    $("#comments").empty();
    // Save the id from the p tag
    const thisId = $(this).attr("data-id");
  
    // Now make an ajax call for the Article
    $.ajax({
      method: "GET",
      url: "/articles/" + thisId
    })
      // With that done, add the comment information to the page
      .then(function(data) {
        console.log("from artscrape.js: " + data);
        // The title of the article
        // An input to enter a new title
        // A textarea to add a new comment body
        // A button to submit a new comment, with the id of the article saved to it
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