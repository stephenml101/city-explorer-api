'use strict'

const axios =require('axios');

async function getMovies(request,response, next) {
  try {
    //TODO: ACCEPT MY QUERIES
    let cityFromFrontEnd = request.query.city_name;
    // TODO: BUILD MY URL FOR AXIOS
    let url = `https://api.themoviedb.org/3/search/movie?api_key=${process.env.MOVIE_API_KEY}&language=en-US&page=1&include_adult=false&query=${cityFromFrontEnd}`;
    let movieResults = await axios.get(url);

    // TODO: GROOM THAT DATA TO SEND TO FRONTEND
    let moviesToSend = movieResults.data.results.map(movie => {
      return new Movies(movie);
    });

    response.status(200).send(moviesToSend);
  } catch (error) {
    next(error);
  }
}

class Movies {
  constructor(movieObj){
    this.title=movieObj.original_title;
    this.overview=movieObj.overview;
    this.image = `https://image.tmdb.org/t/p/w500${movieObj.poster_path}`;
  }
}


module.exports = getMovies;