'use strict'

const axios = require('axios');

let cache = {};

// TODO: create a key for the data I am going to store
// TODO: if the thing exists and within a valid timeframe, send that data from cache
// TODO: if the thing does not exist - call my API and cache that return from the

async function getWeather(request, response, next) {
  try {

    // /weather?lat=Value&lon=Value&city_name=Value
    let lat = request.query.lat;
    let lon = request.query.lon;
    let key = `lat: ${lat} lon: ${lon}-Weather`;

    if (cache[key] && (Date.now() - cache[key].timestamp) < 10000) {
      console.log('Weather cache was hit');

      response.status(200).send(cache[key].data);

    } else {

      console.log('No items in the weather cache!')

      let url = `https://api.weatherbit.io/v2.0/forecast/daily?key=${process.env.WEATHER_API_KEY}&days=6&lat=${lat}&lon=${lon}`;
      
      let weatherResults = await axios.get(url);

      let mappedWeatherToSend = weatherResults.data.data.map(dailyForecast => {
        return new Forecast(dailyForecast);
      });

      // BUILD INTO CACHE
      cache[key] = {
        data: mappedWeatherToSend,
        timestamp: Date.now()
      };
      
      response.status(200).send(mappedWeatherToSend);
      
    }
    

  } catch (error) {
    next(error);
  }
}

class Forecast {
  constructor(weatherObj) {
    this.date = weatherObj.valid_date;
    this.description = weatherObj.weather.description;
    this.lon = weatherObj.lon;
    this.lat = weatherObj.la;
  }
}

module.exports = getWeather;