var topics = [];
var favArray = [];
var currentTopic;
var rating;
var title;
var dataStill;
var dataAnimate;
var dataID;
var favYes;
var favHtmlID;
var gifAmt = 9;
var startAmt = 0;

function loadButtons() {
    $("#topicButtonLoad").empty();
    $("#alertMsg").removeClass("alert alert-info");
    for (var i = 0; i < topics.length; i++) {

        var button = $("<button/>", {
            "id": topics[i],
            "type": "button",
            "class": "topicsButton btn btn-light mr-2",
            text: topics[i]
        }).appendTo("#topicButtonLoad");

        $("<a>", {
            "class": "removeTopic",
            "data-topic": topics[i],
            html: "&#215;"
        }).appendTo(button);

        $("<div>", {
            "class": "topicOverlay",
        }).appendTo(button);
    }

}

function getFavGif() {
    var getStorage = JSON.parse(localStorage.getItem("fav"));
    if (getStorage != null) {
        favArray = JSON.parse(localStorage.getItem("fav"));
    } else {
        favArray = [];
    }
}

function getTopicStorage() {
    var getStorage = JSON.parse(localStorage.getItem("topics"));

    console.log(getStorage);
    if (getStorage != null && getStorage.length != 0) {
        topics = JSON.parse(localStorage.getItem("topics"));
    } else {
        topics = ["dog", "cat", "monkey"];
    }
}

function loadFavGif() {
    if (favArray.length !== 0) {
        for (var i in favArray) {
            var id = favArray[i].favID;
            getAjax(id, true);
        }
    } else {
        removeGifs();
        $("#alertMsg").addClass("alert alert-info");
        $("#alertMsg").text("You don't any favorite gifs.");


    }
}


function getAjax(searchTopic, anID) {

    var apiKey = "brVbgSWm0Qx8rbsX2BvN7DYIZEMGTLIv";
    var queryURL;

    if (anID) {
        removeGifs();
        queryURL = "https://api.giphy.com/v1/gifs/" + searchTopic + "?api_key=" + apiKey;
    } else {
        queryURL = "https://api.giphy.com/v1/gifs/search?q=" + searchTopic + "&api_key=" + apiKey + "&limit=" + gifAmt;
    }
    ////Search for gif ID : https://api.giphy.com/v1/gifs/ GIF-ID  ?api_key=brVbgSWm0Qx8rbsX2BvN7DYIZEMGTLIv

    $.ajax({
            url: queryURL,
            method: "GET"
        })
        .then(function (response) {

            var results = response.data;
            var anArray = Array.isArray(results);

            if (anArray) {

                for (var i in results) {
                    if (i >= startAmt && i <= gifAmt) {
                        rating = results[i].rating;
                        title = results[i].title;
                        dataStill = results[i].images.original_still.url;
                        dataAnimate = results[i].images.original.url;
                        dataID = results[i].id;

                        if (favArray != "" && favArray != null && favArray.length != 0) {
                            for (var favCounter in favArray) {
                                if (dataID === favArray[favCounter].favID) {
                                    favYes = "yes";
                                    favHtmlID = "faved";
                                    break;
                                } else {
                                    favYes = "no";
                                    favHtmlID = "notFaved";
                                }
                            }
                        } else {
                            favYes = "no";
                            favHtmlID = "notFaved";
                        }

                        outputGif();

                    }
                }
            } else {
                rating = results.rating;
                title = results.title;
                dataStill = results.images.original_still.url;
                dataAnimate = results.images.original.url;
                dataID = results.id;
                favYes = "yes";
                favHtmlID = "faved";

                outputGif();
            }




        });
}


function removeAlert() {
    $("#alertMsg").removeClass("alert alert-info");
    $("#alertMsg").empty();
}

function removeGifs() {
    $("#outputGifs").empty();
}

function outputGif() {

    var startDIV = $("<div>", {
        "class": "col-md-4 col-sm-6 imageItem"
    }).appendTo("#outputGifs");

    var gifDiv = $("<div>", {
        "class": "imageContainer"
    }).appendTo(startDIV);

    var gifImage = $("<img>", {
        src: dataStill,
        "class": "gif",
        "data-state": "still",
        "data-still": dataStill,
        "data-animate": dataAnimate,
        "data-id": dataID
    }).prependTo(gifDiv);

    $("<div>").attr("class", "overlay gif").appendTo(gifDiv);

    var metadataDiv = $("<div>", {
        "class": "title",

    }).appendTo(gifDiv);

    $("<h5>", {
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
        "class": "download",
        "data-link": dataAnimate
    }).appendTo(downloadButton);

    $("<i>", {
        "class": "fa fa-download",
    }).appendTo(downloadLink);

    var favorite = $("<a>", {
        "data-faved": favYes,
        "class": "favoriteGif",
        "id": favHtmlID,
        "data-id": dataID
    }).appendTo(downloadButton);

    $("<i>", {
        "class": "fa fa-heart",
    }).appendTo(favorite);
}

function downloadImage(imageLink) {
    //use fetch instead of jquery ajax since it doesnt support downloading as blob
    fetch(imageLink)
        .then(function (response) {
            return response.blob();
        })
        .then(function (blob) {
            // here the image is a blob
            var gifLink = URL.createObjectURL(blob);

            //output to page using html 5 download and trigger the mouse click on the link and remove it after
            var downloadNow = $("<a>", {
                "href": gifLink,
                "download": ""
            }).appendTo("#outputGifs");

            downloadNow[0].click();
            downloadNow.remove();
        });
}

$(document).ready(function () {
    getFavGif();
    getTopicStorage();
    loadButtons();

    $(document).on("click", ".topicOverlay", function () {
        removeGifs();
        removeAlert();
        gifAmt = 9;
        startAmt = 0;

        currentTopic = $(this).parent().text();
        getAjax(currentTopic, false);
        $("#outputLoadMore").empty();
        var startDIV = $("<button>", {
            text: "Load More",
            "id": "loadMoreBtn",
            "class": "btn btn-light mr-2"
        }).appendTo("#outputLoadMore");
    });

    $(document).on("click", ".removeTopic", function () {
        removeTopic = $(this).attr("data-topic");
        topics = $.grep(topics, function (e) {
            return e != removeTopic;
        });
        loadButtons();
        localStorage.setItem("topics", JSON.stringify(topics));

    });

    $(document).on("click", ".gif", function () {
        var gifButton = $(this).parent();
        var getImage = gifButton.find("img");
        var imageAnimate;
        var imageState = getImage.attr("data-state");

        if (imageState === "still") {
            getImage.attr("data-state", "animate");
            imageAnimate = getImage.attr("data-animate");
            getImage.attr("src", imageAnimate);
        } else {
            getImage.attr("data-state", "still");
            imageStill = getImage.attr("data-still");
            getImage.attr("src", imageStill);

        }
    });


    $(document).on("click", "#addTopic", function (event) {
        // event.preventDefault() prevents submit button from trying to send a form.
        // Using a submit button instead of a regular button allows the user to hit
        // "Enter" instead of clicking the button if desired
        event.preventDefault();

        var topicInput = $("#inputTopic").val();
        topics.push(topicInput);
        $("#inputTopic").val("");
        localStorage.setItem("topics", JSON.stringify(topics));
        loadButtons();

    });

    $(document).on("click", "#loadMoreBtn", function (event) {
        event.preventDefault();
        //removeGifs();
        removeAlert();
        startAmt = gifAmt
        gifAmt = gifAmt + 9;
        getAjax(currentTopic, false);

    $(document).on("click", "#removeFav", function (event) {
        event.preventDefault();
        localStorage.removeItem("fav");
        localStorage.removeItem("topics");
        getFavGif();
    });

    });

    $(document).on("click", "#showFav", function (event) {
        event.preventDefault();
        $("#outputLoadMore").empty();
        removeAlert();
        loadFavGif();
    });

    $(document).on("click", "#home", function (event) {
        event.preventDefault();
        removeAlert();
        $("#outputLoadMore").empty();
        removeGifs();
    });

    $(document).on("click", "#removeFav", function (event) {
        event.preventDefault();
        localStorage.removeItem("fav");
        localStorage.removeItem("topics");
        $("#alertMsg").addClass("alert alert-info");
        $("#alertMsg").text("All the favorited gif and topics have been removed!");
        getFavGif();
    });

    $(document).on("click", ".download", function (event) {
        event.preventDefault();
        var imageLink = $(this).attr("data-link");
        downloadImage(imageLink);
    });

    $(document).on("click", ".favoriteGif", function (event) {
        event.preventDefault();
        //Search for gif ID : https://api.giphy.com/v1/gifs/ GIF-ID  ?api_key=brVbgSWm0Qx8rbsX2BvN7DYIZEMGTLIv

        var favObject = {};
        var faved = $(this).attr("data-faved");
        var favID = $(this).attr("data-id");

        if (faved === "no") {
            $(this).attr("data-faved", "yes");
            $(this).attr("id", "faved");
            favObject = {
                "favID": favID
            };
            favArray.push(favObject);
            localStorage.setItem("fav", JSON.stringify(favArray));
        } else {
            favArray = $.grep(favArray, function (e) {
                return e.favID != favID;
            });
            localStorage.setItem("fav", JSON.stringify(favArray));
            $(this).attr("data-faved", "no");
            $(this).attr("id", "notFaved");
        }
    });

});