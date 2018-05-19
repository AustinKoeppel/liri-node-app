let dotEnv = require("dotenv").config();
let keys = require("./keys.js");
let request = require("request");
let Spotify = require("node-spotify-api");
let Twitter = require("twitter");
let spotify = new Spotify(keys.spotify);
let twitter = new Twitter(keys.twitter);
var fs = require("fs");


function main(argv) {
    if(argv[0]) {
        let action = argv[0];
        switch(action){
            case "my-tweets": getTweets(argv.slice(1,argv.length))
                break;
            case "spotify-this-song": getSong(argv.slice(1,argv.length))
                break;
            case "movie-this": getMovie(argv.slice(1,argv.length))
                break;
            case "do-what-it-says": runFile(argv.slice(1,argv.length))
                break;
        }
    }
    // let response = prompt("Run another command Y/N","N")
    // if(response.toLowerCase() == "n"){
    //     let command = prompt("Run another command Y/N","")
    //     command = command.split(" ");
    //     main(command);
    // }
}

function getTweets(arv) {
      var params = {screen_name: 'TestBeforeDev'};
      twitter.get('statuses/user_timeline', params, function(error, tweets, response) {
        if (!error) {
            for(tweet in tweets) {
                logOut(tweets[tweet].created_at);
                logOut("Tweet: " + tweets[tweet].text);
                logOut("");
            }
          
        }
        else {
            logOut("ERROR " + error);
        }
      });
}

function getSong(arv) {
    let song = "";
    
    if(arv) {
        arv.forEach(element => {
            song = song + element + " ";
        });
    }
    else {
        song = "The Sign";
    }

    spotify.search({ type: 'track', query: song}, function(err, data) {
        if ( err ) {
            logOut('Error occurred: ' + err);
            return;
        }
        for(var i = 0; i < data.tracks.items || i < 3; i++) {
            let element = data.tracks.items[i];
            logOut("here are the results for the song: " + element.name);
            logOut("Album: " + element.album.name);
            let artists = "";
            element.album.artists.forEach(artist => {
                artists = artists + artist.name + " ";
            })
            logOut("Artists: " + artists);
            logOut("Preview: " +  element.preview_url);
            logOut("");
        }
    });
}

function getMovie(arv) {
    var movieName = "";
    
    if(arv) {
        arv.forEach(element => {
            movieName = movieName + element + " ";
        });
    }

    else {
        movieName = "Mr. Nobody";
    }
    var queryUrl = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=trilogy";

    request(queryUrl, function(error, response, body) {
     if (!error && response.statusCode === 200) {
        logOut("Title: " + JSON.parse(body).Title);
        logOut("Year: " + JSON.parse(body).Year);
        logOut("IMDB Rating: " + JSON.parse(body).imdbRating);
        let rt;
        if(JSON.parse(body).Ratings) {
            JSON.parse(body).Ratings.forEach(element=>{
                if(element.Source=="Rotten Tomatoes"){
                    rt = element.Source.Value;
                    return;
                }
            });
        }
        logOut("RT Rating: " + rt);
        logOut("Production Country: " + JSON.parse(body).Country);
        logOut("Language: " + JSON.parse(body).Language);
        logOut("Plot: " + JSON.parse(body).Plot);
        logOut("Actors: " + JSON.parse(body).Actors);
        logOut("");
    }
    });
}

function runFile(arv) {
    fs.readFile("./random.txt", "utf8", function(error, data) {
        if (error) {
          return logOut(error);
        }
        var dataArr = data.split("\n");
        dataArr.forEach(element=>{
            main(element.split(","));
        })
        logOut(dataArr);
      });
}

function logOut(message) {
    fs.appendFile("./log.txt","\n" + message,function(err) {
        if(err) {
            return console.log(err);
        }
        console.log(message);
    });
}

main(process.argv.slice(2,process.argv.length))