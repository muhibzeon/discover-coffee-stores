//Four Square API Implementation to get all the coffee stores

import { createApi } from "unsplash-js";

const unsplash = createApi({
  accessKey: process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY,
});

//make request to four quare api
const getUrl = function (query, latLong, limit) {
  return `https://api.foursquare.com/v3/places/search?query=${query}&ll=${latLong}&limit=${limit}`;
};
//client_id=${process.env.NEXT_PUBLIC_FOURSQUARE_CLIENT_ID}&client_secret=${process.env.NEXT_PUBLIC_FOURSQUARE_CLIENT_SECRET}
//GEt photos from unplash
const getListOfPhotos = async function () {
  const photos = await unsplash.search.getPhotos({
    query: "coffee shop",
    perPage: 30,
  });
  //console.log({ photos });

  const unsplashResults = photos.response.results;

  return unsplashResults.map((result) => result.urls["small"]);
};

const randomNumber = function (max) {
  return Math.floor(Math.random * max);
};

//Calling api and passing parameter

//So first line the parameter is Latlong which is coming from the user through GeoLocation
//Beforehand we were doing it manually

//= "52.1205%2C11.6276"
export const fetchCoffeeStores = async function (latLong = "", limit = 30) {
  const photos = await getListOfPhotos();

  //fetch method takes options, So we are passing it as per Four Square
  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization: process.env.NEXT_PUBLIC_FOURSQUARE_API_KEY,
    },
  };

  //Take the response and await it
  const response = await fetch(getUrl("coffee", latLong, limit), options);
  //Convert it into JSON, every response has this json() method
  const data = await response.json();

  //Now map the data and return it
  return data.results.map((result, idx) => {
    return {
      ...result,
      imgUrl: photos.length > 0 ? photos[idx] : null,
    };
  });
};
