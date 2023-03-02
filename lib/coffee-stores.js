import { createApi } from "unsplash-js";

const unsplash = createApi({
  accessKey: process.env.UNSPLASH_ACCESS_KEY,
});

//make request to four quare api
const getUrl = function (query, latLong, limit) {
  return `https://api.foursquare.com/v3/places/search?query=${query}&ll=${latLong}&limit=${limit}`;
};

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

export const fetchCoffeeStores = async function () {
  const photos = await getListOfPhotos();

  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization: process.env.FOURSQUARE_API_KEY,
    },
  };

  //Calling api and passing parameter
  const response = await fetch(
    getUrl("coffee", "52.1205%2C11.6276", 8),
    options
  );
  const data = await response.json();
  return data.results.map((result, idx) => {
    return {
      ...result,
      imgUrl: photos[idx],
    };
  });
};
