var topics = ["dog", "cat", "monkey"];
var favArray= [];
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
                    var dataStill = results[i].images.original_still.url
                    var dataAnimate = results[i].images.original.url
                    var dataID = results[i].id

                    //var p = $("<p>").text("Rating: " + rating);

                    var gifImage = $("<img>", {
                        src: dataStill,
                        "class": "gif",
                        //"style" : "height: 400px"
                        "data-state": "still",
                        "data-still": dataStill,
                        "data-animate": dataAnimate,
                        "data-id" : dataID
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
                        "href" : dataAnimate,
                        "data-link": dataAnimate
                    }).appendTo(downloadButton);

                    $("<i>", {
                        "class": "fa fa-download",
                    }).appendTo(downloadLink);

                    var favorite = $("<a>", {
                        "data-faved" : "no",
                        "class" : "favoriteGif",
                        "data-title" : title,
                        "data-still" : dataStill,
                        "data-Animate" : dataAnimate,
                        "data-rating": rating,
                        "data-id" : dataID
                    }).appendTo(downloadButton);

                    $("<i>", {
                        "class": "fa fa-heart",
                    }).appendTo(favorite);

                    //$("#outputGifs").prepend(gifDiv);
                }
            });

    });

    $(document).on("click", ".gif", function () {
        //console.log("test");
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



        //Search for gif ID : https://api.giphy.com/v1/gifs/ GIF-ID  ?api_key=brVbgSWm0Qx8rbsX2BvN7DYIZEMGTLIv

        var favObject = {};
        var favTitle = $(this).attr("data-title");
        var favStill = $(this).attr("data-still");
        var favAnimate= $(this).attr("data-animate");
        var favRating = $(this).attr("data-rating");
        var faved = $(this).attr("data-faved");
        var favID = $(this).attr("data-id");

        if (faved === "no") {
            $(this).attr("data-faved", "yes")
            $(this).attr("id", "faved")
            favObject = {
                "favTitle" : favTitle,
                "favStill" : favStill,
                "favAnimate" : favAnimate,
                "favRating" : favRating,
                "favID" : favID
            }

            favArray.push(favObject)
            localStorage.setItem("fav",JSON.stringify(favArray))
            console.log(favTitle,favStill,favAnimate,favRating);
        }
    });


});