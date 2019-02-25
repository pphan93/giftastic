var topics = ["dog", "cat", "monkey"];
var currentTopic;

function loadButtons() {
    $("#topicButtonLoad").empty();
    for (var i = 0; i < topics.length; i++) {


        console.log("test");
        $("<button/>", {
            "id": topics[i],
            "type": "button",
            "class": "topicsButton btn btn-primary m-1",
            text: topics[i]
        }).appendTo("#topicButtonLoad");
    }

}


$(document).ready(function () {
    loadButtons();

    $(document).on("click", ".topicsButton", function () {
        currentTopic = $(this).text();
        $("#outputGifs").empty();

        console.log(currentTopic);
        var queryURL = "https://api.giphy.com/v1/gifs/search?q=" +
            currentTopic + "&api_key=brVbgSWm0Qx8rbsX2BvN7DYIZEMGTLIv&limit=10";

        $.ajax({
                url: queryURL,
                method: "GET"
            })

            .then(function (response) {

                var results = response.data;

                for (var i = 0; i < results.length; i++) {
                    var gifDiv = $("<div>",{
                        "class" : "card",
                        "style": "width:400px"

                    });
                    //gifDiv.attr("class", "gif card");
                   // gifDiv.attr("data-state", "still");

                    var rating = results[i].rating;
                    var title = results[i].title;

                    //var p = $("<p>").text("Rating: " + rating);

                    var gifImage = $("<img>",{
                        src: results[i].images.original_still.url,
                        "class" : "card-img-top gif",
                        "style" : "height: 400px",
                        "data-state": "still",
                        "data-still" : results[i].images.original_still.url,
                        "data-animate" : results[i].images.original.url
                    }).prependTo(gifDiv);


                    var cardBody = $("<div>", {
                        "class" : "card-body",
                    }).appendTo(gifDiv);

                    $("<h4>", {
                        "class" : "card-title",
                        text: title
                    }).appendTo(cardBody);

                    $("<p>", {
                        "class" : "card-text",
                        text: "Rating: " + rating
                    }).appendTo(cardBody);

                    var downloadButton = $("<a>", {
                        "class" : "card-text btn download",
                        //"download" : "gifImage.gif",
                        "data-link" : results[i].images.original.url
                    }).appendTo(cardBody);

                    $("<i>", {
                        "class" : "fa fa-download",
                    }).appendTo(downloadButton);

                    //gifImage.attr("src", results[i].images.fixed_height_still.url);
                    //gifImage.attr("data-still", results[i].images.fixed_height_still.url);
                    //gifImage.attr("data-animate", results[i].images.fixed_height.url);
                    //personImage.attr("data-state", "still");
                    // personImage.attr("class", "gif");

                    //gifDiv.prepend(p);
                    //gifDiv.prepend(gifImage);

                    $("#outputGifs").prepend(gifDiv);
                }
            });

    });

    $(document).on("click", ".gif", function () {
        console.log("test");
        //var gifButton = $(this);
        var getImage = $(this);
        var imageAnimate;
        var imageState = getImage.attr("data-state");
        //var getImage = gifButton.find("img");


        if (imageState === "still") {
            getImage.attr("data-state", "animate");
            imageAnimate = getImage.attr("data-animate");
            getImage.attr("src", imageAnimate);
        } else {
            getImage.attr("data-state", "still");
            imageStill = getImage.attr("data-still");
            getImage.attr("src", imageStill);

        }

        //console.log(imageAnimate);

    });


    $(document).on("click", "#addTopic", function (event) {
        // event.preventDefault() prevents submit button from trying to send a form.
        // Using a submit button instead of a regular button allows the user to hit
        // "Enter" instead of clicking the button if desired
        event.preventDefault();

        var topicInput = $("#inputTopic").val();
        topics.push(topicInput);
        $("#inputTopic").val("");
        loadButtons();
    });


    
    $(document).on("click", ".download", function (event) {
        // event.preventDefault() prevents submit button from trying to send a form.
        // Using a submit button instead of a regular button allows the user to hit
        // "Enter" instead of clicking the button if desired
        event.preventDefault();
        var download = $(this);
        window.location = download.attr("data-link");
        console.log("test");
    });

});