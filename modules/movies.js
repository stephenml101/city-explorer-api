'use strict'

const axios = require('axios');

let cache = {};

// TODO: create a key for the data I am going to store
// TODO: if the thing exists and within a valid timeframe, send that data from cache
// TODO: if the thing does not exist - call my API and cache that return from the

async function getMovies(request, response, next) {
  try {
    //TODO: ACCEPT MY QUERIES
    let cityFromFrontEnd = request.query.city_name;

    let key = `${cityFromFrontEnd}-Movie`; // key = Seattle-Movie

    if (cache[key] && (Date.now() - cache[key].timestamp) < 10000) {
      console.log('Movies cache was hit!')

      response.status(200).send(cache[key].data)
    } else {

      console.log('No items in cache');

      let url = `https://api.themoviedb.org/3/search/movie?api_key=${process.env.MOVIE_API_KEY}&language=en-US&page=1&include_adult=false&query=${cityFromFrontEnd}`;
      // TODO: BUILD MY URL FOR AXIOS
      let movieResults = await axios.get(url);

      // TODO: GROOM THAT DATA TO SEND TO FRONTEND
      let moviesToSend = movieResults.data.results.map(movie => {
        return new Movies(movie);
      });

      // BUILD INTO CACHE
      cache[key] = {
        data: moviesToSend,
        timestamp: Date.now()
      };

      response.status(200).send(moviesToSend);
    }


  } catch (error) {
    next(error);
  }
}

class Movies {
  constructor(movieObj) {
    this.title = movieObj.original_title;
    this.overview = movieObj.overview;
    this.image = `https://image.tmdb.org/t/p/w500${movieObj.poster_path}`;
  }
}


module.exports = getMovies;