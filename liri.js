//takes the users input in termainal after "node liri.js ..." and puts into an array.
var input = process.argv;
var searchString = "";
var movieName = "";
var array = [];

// Capture all the words in the song (again ignoring the first two Node arguments)
if (input[2]==="spotify-this-song"){
  for (var i = 3; i < input.length; i++) {

    // Build a string with the song name.
    searchString = searchString + " " + input[i];
  }
  console.log(searchString);
}
// Capture all the words in the movie (again ignoring the first two Node arguments)
if (input[2]==="movie-this"){
  for (var i = 3; i < input.length; i++) {

    // Build a string with the movie name.
    movieName = movieName + "+" + input[i];
  }
  console.log(movieName);
}

//variables of NPMs installed
var request = require("request");
var dotenv = require("dotenv").config();
var Twitter = require('twitter');
var Spotify = require('node-spotify-api');
var inquirer = require("inquirer");
var fs = require("fs");

//variable for keys.js to be recognized in liri app
var keys = require("./keys.js")

//code required to import keys
var client = new Twitter(keys.twitter);
var spotify = new Spotify(keys.spotify);



//>>>>>>>>>>>>>>>>>>>>>>>>>>>my-tweets function
function getTweets(){
  if ( input[2] === "my-tweets"){
    var params = {
      count: 10
    }
    client.get('statuses/user_timeline', params, searchedData);
    console.log("hello");
    function searchedData(err, data, response) {
      console.log("\n>>>>>>>>>>>>>>>>>>>>>>>>>>>>Last 10 Tweets<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<\n")
      for(var i = 0; i < data.length; i++){
      console.log(([i+1] + ". " + "\n" + "On " + data[i].created_at + "\n" + data[i].user.screen_name +  " said: " + "\n" + data[i].text) + "\n" + "\n================================================================================\n");

      }
    }
  }
};
getTweets();

//>>>>>>>>>>>>>>>>>>>>>>>>>Spotify search function
function searchSpotify(){
  if ( input[2] === "spotify-this-song" && searchString !== ""){ 

    spotify.search({ type: 'track', query: searchString, limit: 2}, function(err, data) {
      if (err) {
        return console.log('Error occurred: ' + err);
      }
    
      console.log("Song: " + data.tracks.items[0].name); 
      console.log("Artist: " + data.tracks.items[0].album.artists[0].name); 
      console.log("Album: " + data.tracks.items[0].album.name); 
      console.log("Preview URL: " + data.tracks.items[0].preview_url + "\n\n================================================================================\n"); 

    });
    console.log("\n>>>>>>>>>>>>>>>>>>>>Is this the song you are searching for?<<<<<<<<<<<<<<<<<<<<<\n")

  } 
//default search return if search query is left blank in terminal
  else if (input[2] === "spotify-this-song" && searchString === ""){
    spotify.search({ type: 'track', query: "the sign ace of base", limit: 2}, function(err, data) {
      if (err) {
        return console.log('Error occurred: ' + err);
      }
    
    console.log("Song: " + data.tracks.items[0].name); 
    console.log("Artist: " + data.tracks.items[0].album.artists[0].name); 
    console.log("Album: " + data.tracks.items[0].album.name); 
    console.log("Preview URL: " + data.tracks.items[0].preview_url + "\n\n================================================================================\n"); 

    });
    console.log("\n>>>>>>>>>>>>>>>>>>>>Is this the Song you are searching for?<<<<<<<<<<<<<<<<<<<<<\n")

  }
};
searchSpotify();

//>>>>>>>>>>>>>>>>>>>>>>Search omdb function for movie information
function searchMovie(){
  if ( input[2] === "movie-this" && movieName !== ""){ 

    var queryUrl = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=trilogy";
    console.log(queryUrl);

    request(queryUrl, function(error, response, body) {

      // If the request is successful
      if (!error && response.statusCode === 200) {

        // Parse the body of the site and recover just the imdbRating
        // (Note: The syntax below for parsing isn't obvious. Just spend a few moments dissecting it).
        console.log("\n>>>>>>>>>>>>>>>>>>>>Is this the Movie you are searching for?<<<<<<<<<<<<<<<<<<<<<\n")
        console.log("Movie: " + JSON.parse(body).Title);
        console.log("Release Year: " + JSON.parse(body).Year);
        console.log("IMDB Rating: " + JSON.parse(body).Ratings[0].Value);
        console.log("Rotten Tomatoes Rating: " + JSON.parse(body).Ratings[1].Value);
        console.log("Country of Origin: " + JSON.parse(body).Country);
        console.log("Language: " + JSON.parse(body).Language);
        console.log("Plot: " + JSON.parse(body).Plot);
        console.log("Starring: " + JSON.parse(body).Actors+ "\n\n================================================================================\n");
      }
    });


  }
  else if ( input[2] === "movie-this" && movieName === ""){
    
    var queryUrl = "http://www.omdbapi.com/?t=mr+nobody&y=&plot=short&apikey=trilogy";
    console.log(queryUrl);

    request(queryUrl, function(error, response, body) {

      // If the request is successful
      if (!error && response.statusCode === 200) {

        // Parse the body of the site and recover just the imdbRating
        // (Note: The syntax below for parsing isn't obvious. Just spend a few moments dissecting it).
        console.log("\n>>>>>>>>>>>>>>>>>>>>Is this the Movie you are searching for?<<<<<<<<<<<<<<<<<<<<<\n")
        console.log("Movie: " + JSON.parse(body).Title);
        console.log("Release Year: " + JSON.parse(body).Year);
        console.log("IMDB Rating: " + JSON.parse(body).Ratings[0].Value);
        console.log("Rotten Tomatoes Rating: " + JSON.parse(body).Ratings[1].Value);
        console.log("Country of Origin: " + JSON.parse(body).Country);
        console.log("Language: " + JSON.parse(body).Language);
        console.log("Plot: " + JSON.parse(body).Plot);
        console.log("Starring: " + JSON.parse(body).Actors+ "\n\n================================================================================\n");
      }

    });
  }
};
searchMovie();

//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>write to text function
function fileReader (){
if ( input[2] === "do-what-it-says"){ 
  //function useText() {

    // We will read the existing bank file
    fs.readFile("random.txt", "utf-8", function(err, data) {
      if (err) {
        return console.log(err);
      }
  
      // Break down all the numbers inside
      var dataArray = data.split(",");
      if (dataArray[0] === "spotify-this-song"){
        spotify.search({ type: 'track', query: dataArray[1], limit: 2}, function(err, data) {
          if (err) {
            return console.log('Error occurred: ' + err);
          }
        
          console.log("Song: " + data.tracks.items[0].name); 
          console.log("Artist: " + data.tracks.items[0].album.artists[0].name); 
          console.log("Album: " + data.tracks.items[0].album.name); 
          console.log("Preview URL: " + data.tracks.items[0].preview_url + "\n\n================================================================================\n"); 
      
        });
        console.log("\n>>>>>>>>>>>>>>>>>>>>Is this the song you are searching for?<<<<<<<<<<<<<<<<<<<<<\n")

      }
  
      // We will then print the final balance rounded to two decimal places.
    });
  }
  //console.log(dataArray);
}
fileReader();

// inquirer.prompt([

//   {
//   type: "list",
//   message: "What would you like to do?",
//   choices: ["Check Twitter", "Find Song on Spotify", "Look up Movie Info", "Perform Commands form .txt File"],
//   name: "heyLiri"
//   }

// ])
// .then(function(inquireResponse){
  
//   if (inquireResponse.heyLiri === "Check Twitter"){
//     inquirer.prompt([

//       {
//       type: "list",
//       message: "What would you like to see on your Twitter?",
//       choices: ["Last Post", "Last 5 Posts", "Last 10 Posts", "Last 20 Posts"],
//       name: "numOfPosts"
//       }
//     ])
//     .then(function(inquireResponse){
//       if(inquireResponse.numOfPosts === "Last Post"){
//         var params = {
//           count: 1
//         }
//         client.get('statuses/user_timeline', params, searchedData);
//         console.log("hello");
//         function searchedData(err, data, response) {
//           console.log("\n>>>>>>>>>>>>>>>>>>>>>>>>>>>>Last 10 Tweets<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<\n")
//           for(var i = 0; i < data.length; i++){
//           console.log(([i+1] + ". " + "\n" + "On " + data[i].created_at + "\n" + data[i].user.screen_name +  " said: " + "\n" + data[i].text) + "\n" + "\n================================================================================\n");
//           }
//         }
//       }
//       else if(inquireResponse.numOfPosts === "Last 5 Posts"){
//         var params = {
//           count: 5
//         }
//         client.get('statuses/user_timeline', params, searchedData);
//         console.log("hello");
//         function searchedData(err, data, response) {
//           console.log("\n>>>>>>>>>>>>>>>>>>>>>>>>>>>>Last 10 Tweets<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<\n")
//           for(var i = 0; i < data.length; i++){
//           console.log(([i+1] + ". " + "\n" + "On " + data[i].created_at + "\n" + data[i].user.screen_name +  " said: " + "\n" + data[i].text) + "\n" + "\n================================================================================\n");
//           }
//         }
//       }
//       else if(inquireResponse.numOfPosts === "Last 10 Posts"){
//         var params = {
//           count: 10
//         }
//         client.get('statuses/user_timeline', params, searchedData);
//         console.log("hello");
//         function searchedData(err, data, response) {
//           console.log("\n>>>>>>>>>>>>>>>>>>>>>>>>>>>>Last 10 Tweets<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<\n")
//           for(var i = 0; i < data.length; i++){
//           console.log(([i+1] + ". " + "\n" + "On " + data[i].created_at + "\n" + data[i].user.screen_name +  " said: " + "\n" + data[i].text) + "\n" + "\n================================================================================\n");
//           }
//         }
//       }
//       else if(inquireResponse.numOfPosts === "Last 20 Posts"){
//         var params = {
//           count: 20
//         }
//         client.get('statuses/user_timeline', params, searchedData);
//         console.log("hello");
//         function searchedData(err, data, response) {
//           console.log("\n>>>>>>>>>>>>>>>>>>>>>>>>>>>>Last 10 Tweets<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<\n")
//           for(var i = 0; i < data.length; i++){
//           console.log(([i+1] + ". " + "\n" + "On " + data[i].created_at + "\n" + data[i].user.screen_name +  " said: " + "\n" + data[i].text) + "\n" + "\n================================================================================\n");
//           }
//         }
//       }
//     })
      
//   }
//   else if (inquireResponse.heyLiri === "Find Song on Spotify"){
//     inquirer.prompt([

//       {
//       type: "input",
//       message: "What song do you want to look up?",
//       name: "songInput"
//       }
//     ])
//     .then(function(inquireResponse){
//       if (inquireResponse.songInput === "") {

//           spotify.search({ type: 'track', query: "the sign ace of base", limit: 2}, function(err, data) {
//             if (err) {
//               return console.log('Error occurred: ' + err);
//             }
          
//           console.log("Song: " + data.tracks.items[0].name); 
//           console.log("Artist: " + data.tracks.items[0].album.artists[0].name); 
//           console.log("Album: " + data.tracks.items[0].album.name); 
//           console.log("Preview URL: " + data.tracks.items[0].preview_url + "\n\n================================================================================\n"); 
      
//           });
//           console.log("\n>>>>>>>>>>>>>>>>>>>>Is this the Song you are searching for?<<<<<<<<<<<<<<<<<<<<<\n")
      
//       }
//       else if (inquireResponse.songInput !== ""){

//         spotify.search({ type: 'track', query: inquireResponse.songInput, limit: 2}, function(err, data) {
//           if (err) {
//             return console.log('Error occurred: ' + err);
//           }
        
//         console.log("Song: " + data.tracks.items[0].name); 
//         console.log("Artist: " + data.tracks.items[0].album.artists[0].name); 
//         console.log("Album: " + data.tracks.items[0].album.name); 
//         console.log("Preview URL: " + data.tracks.items[0].preview_url + "\n\n================================================================================\n"); 
    
//         });
//         console.log("\n>>>>>>>>>>>>>>>>>>>>Is this the Song you are searching for?<<<<<<<<<<<<<<<<<<<<<\n")
    
//     }

//     })
//   }
//   else if (inquireResponse.heyLiri === "Look up Movie Info"){
//     inquirer.prompt([

//       {
//       type: "input",
//       message: "What movie do you want to look up?",
//       name: "movieInput"
//       }
//     ])
//     .then(function(inquireResponse){
//       if (inquireResponse.movieInput === ""){
//         var queryUrl = "http://www.omdbapi.com/?t=mr+nobody&y=&plot=short&apikey=trilogy";
//         console.log(queryUrl);
    
//         request(queryUrl, function(error, response, body) {
    
//           // If the request is successful
//           if (!error && response.statusCode === 200) {
    
//             // Parse the body of the site and recover just the imdbRating
//             // (Note: The syntax below for parsing isn't obvious. Just spend a few moments dissecting it).
//             console.log("\n>>>>>>>>>>>>>>>>>>>>Is this the Movie you are searching for?<<<<<<<<<<<<<<<<<<<<<\n")
//             console.log("Movie: " + JSON.parse(body).Title);
//             console.log("Release Year: " + JSON.parse(body).Year);
//             console.log("IMDB Rating: " + JSON.parse(body).Ratings[0].Value);
//             console.log("Rotten Tomatoes Rating: " + JSON.parse(body).Ratings[1].Value);
//             console.log("Country of Origin: " + JSON.parse(body).Country);
//             console.log("Language: " + JSON.parse(body).Language);
//             console.log("Plot: " + JSON.parse(body).Plot);
//             console.log("Starring: " + JSON.parse(body).Actors+ "\n\n================================================================================\n");
//           }
    
//         });
//       }
//       else if (inquireResponse.movieInput !== ""){
//         var queryUrl = "http://www.omdbapi.com/?t=" + inquireResponse.movieInput + "&y=&plot=short&apikey=trilogy";
//         console.log(queryUrl);
    
//         request(queryUrl, function(error, response, body) {
    
//           // If the request is successful
//           if (!error && response.statusCode === 200) {
    
//             // Parse the body of the site and recover just the imdbRating
//             // (Note: The syntax below for parsing isn't obvious. Just spend a few moments dissecting it).
//             console.log("\n>>>>>>>>>>>>>>>>>>>>Is this the Movie you are searching for?<<<<<<<<<<<<<<<<<<<<<\n")
//             console.log("Movie: " + JSON.parse(body).Title);
//             console.log("Release Year: " + JSON.parse(body).Year);
//             console.log("IMDB Rating: " + JSON.parse(body).Ratings[0].Value);
//             console.log("Rotten Tomatoes Rating: " + JSON.parse(body).Ratings[1].Value);
//             console.log("Country of Origin: " + JSON.parse(body).Country);
//             console.log("Language: " + JSON.parse(body).Language);
//             console.log("Plot: " + JSON.parse(body).Plot);
//             console.log("Starring: " + JSON.parse(body).Actors+ "\n\n================================================================================\n");
//           }
//         });
//       }
//     })
//   }
// });


