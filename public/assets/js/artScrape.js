// Grab the articles as a json
$.getJSON("/articles", function(data) {
    // For each one
    var articles = [];
    // data.forEach(function(result){
    //     console.log(result);
    // })
    for (var i = 0; i < data.length; i++) {
      // Display the apropos information on the page
      $("#articles").append(`
      <p data-id="${data[i]._id}"> ${data[i].title}  
      <br /> 
      ${data[i].link}
      <br />
      ${data[i].excerpt}
      </p>
      `);
  };
});