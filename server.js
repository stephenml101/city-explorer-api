'use strict'

console.log('Yes our first server! Woo!');

// REQUIRES (Like import but for backend)

const express = require('express');
require('dotenv').config();
const cors = require('cors');

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

app.get('/weather', (request, response,next) => {
  console.log('this is the request', request)
  try {
    // let lat = request.query.lat;
    // let lon = request.query.lon;
    let searchQuery = request.query.city_name;
    console.log('this is the search query', searchQuery);
      let cityData = data.find(e => e.city_name === searchQuery);



      let returnData = cityData.data.map(eachDay => {
        return new Forecast(eachDay);

      })
      
      response.status(200).send(returnData);
  } catch(error) {
    next(error);
  }
});

// Class to groom bulk data

class Forecast {
  constructor (weatherObj){
    console.log(weatherObj)
      this.date = weatherObj.valid_date;
      this.description = weatherObj.weather.description; 
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