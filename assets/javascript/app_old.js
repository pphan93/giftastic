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
            currentTopic + "&api_key=brVbgSWm0Qx8rbsX2BvN7DYIZEMGTLIv&limit=9";

        $.ajax({
                url: queryURL,
                method: "GET"
            })

            .then(function (response) {

                var results = response.data;

                for (var i = 0; i < results.length; i++) {

                    var startDIV = $("<div>", {
                        "class": "col-md-4 col-sm-6 imageItem"
                        //"style": "width:400px"
                    }).appendTo("#outputGifs");

                    var gifDiv = $("<div>", {
                        "class": "imageContainer"
                        //"style": "width:400px"
                    }).appendTo(startDIV);
                    //gifDiv.attr("class", "gif card");
                    // gifDiv.attr("data-state", "still");

                    var rating = results[i].rating;
                    var title = results[i].title;

                    //var p = $("<p>").text("Rating: " + rating);

                    var gifImage = $("<img>", {
                        src: results[i].images.original_still.url,
                        "class": "gif",
                        //"style" : "height: 400px"
                        "data-state": "still img-fluid",
                        "data-still": results[i].images.original_still.url,
                        "data-animate": results[i].images.original.url
                    }).prependTo(gifDiv);

                    $("<div>").attr("class", "overlay gif").appendTo(gifDiv);

                    //var cardBody = $("<div>", {
                    //    "class" : "card-body",
                    //}).appendTo(gifDiv);

                    var metadataDiv = $("<div>", {
                        "class": "title",

                    }).appendTo(gifDiv);

                    $("<h4>", {
                        "class": "m-0",
                        text: title
                    }).appendTo(metadataDiv);

                    $("<p>", {
                        "class": "m-0",
                        text: "Rating: " + rating
                    }).appendTo(metadataDiv);

                    var downloadButton = $("<div>", {
                        "class": "Gifbutton"
                    }).appendTo(gifDiv);

                    var downloadLink = $("<a>", {
                        "download": "",
                        "data-link": results[i].images.original.url
                    }).appendTo(downloadButton);

                    $("<i>", {
                        "class": "fa fa-download",
                    }).appendTo(downloadLink);

                    var favorite = $("<a>", {
                        "class" : "favoriteGif"
                    }).appendTo(downloadButton);

                    $("<i>", {
                        "class": "fa fa-heart",
                    }).appendTo(favorite);

                    //$("#outputGifs").prepend(gifDiv);
                }
            });

    });

    $(document).on("click", ".gif", function () {
        console.log("test");
        var gifButton = $(this).parent();
        var getImage = gifButton.find("img");
        //var getImage = $(this);
        var imageAnimate;
        var imageState = getImage.attr("data-state");


        console.log(getImage);

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

    $(document).on("click", ".favoriteGif", function (event) {
        // event.preventDefault() prevents submit button from trying to send a form.
        // Using a submit button instead of a regular button allows the user to hit
        // "Enter" instead of clicking the button if desired
        event.preventDefault();
        console.log("testFavorite");
    });


});