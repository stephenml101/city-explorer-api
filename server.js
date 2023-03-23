'use strict'

console.log('Yes our first server! Woo!');

// REQUIRES (Like import but for backend)

const express = require('express');
require('dotenv').config();
const cors = require('cors');
const axios =require('axios');

let data = require('./data/weather.json')

// Once we bring in express we call it to create the server
// app === server
const app = express();

// Middleware - cors
app.use(cors());

// Port that my server will run on
const PORT = process.env.PORT || 3002;

app.listen(PORT, ()=> console.log(`We are running on port ${PORT}`));

// Endpoints

// Base endpoint - proof of life
// 1st arg - string url in quotes
// 2nd arg - callback that will execute when that endpoint is hit

app.get('/', (request, response) => {
  response.status(200).send('Welcome to my server!');
});

app.get('/hello', (request, response) => {

  let userFirstName = request.query.firstName;
  let userLastName = request.query.lastName;

  response.status(200).send(`Hello ${userFirstName} ${userLastName}! Welcome to my server!`);
});

 // TODO: WEATHER
app.get('/weather', (request, response, next) => {
  try {

    // /weather?lat=Value&lon=Value&city_name=Value
    let lat = request.query.lat;
    let lon = request.query.lon;
    let searchQuery = request.query.city_name;
    console.log(request.query);
    
   
    let url = `https://api.weatherbit.io/v2.0/forecast/daily?key=${process.env.WEATHER_API_KEY}&days=6&lat=${lat}&lon=${lon}`;
    let weatherResults = await axios.get(url);

let mappedWeatherToSend = weatherResults.data.data.map(dailyForecast => {
  return new Forecast(dailyForecast);
});
      
      response.status(200).send(moviesToSend);
  } catch(error) {
    next(error);
  }
});
// TODO: MOVIES
app.get('/movies', async (request, response, next) => {

  try {
    //TODO: ACCEPT MY QUERIES
    let keywordFromFrontEnd = request.query.searchQuery;
    // TODO: BUILD MY URL FOR AXIOS
    let url = `https://api.themoviedb.org/3/search/movie?api_key=${process.env.MOVIES_API_KEY}&language=en-US&page=1&include_adult=false&query=${keywordFromFrontEnd}`;
    let movieResults = await axios.get(url);

    // TODO: GROOM THAT DATA TO SEND TO FRONTEND
    let moviesToSend = movieResults.data.results.map(movie => {
      return new Movies(movie);
    });

    response.status(200).send(moviesToSend);
  } catch (error) {
    next(error);
  }

class Forecast {
  constructor (weatherObj){
      this.date = weatherObj.valid_date;
      this.description = weatherObj.weather.description; 
      this.lon = weatherObj.lon;
    this.lat = weatherObj.la;
  }
}

class Movies {
  constructor(movieObj){
    this.title=movieObj.original_title;
    this.overview=movieObj.overview;
    this.image = `https://image.tmdb.org/t/p/w500${movieObj.poster_path}`;
  }
}

// Catch all - be at the bottom and serve as a  404 error
app.get('*', (request, response) => {
  response.status(404).send('This route does not exist')
});

// **** ERROR HANDLING - PLUG AND PLAY CODE FROM EXPRESS DOCS ****
app.use((error, request, response, next) => {
  response.status(500).send(error.message);
});