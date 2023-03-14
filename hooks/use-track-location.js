//Geo Location API to get Lat and Long

import { useContext, useState } from "react";
import { ACTION_TYPE, StoreContext } from "../store/store-context";

const useTrackLocation = () => {
  const [locationErrMsg, setLocationErrMsg] = useState("");
  //const [latLong, setLatLong] = useState("");
  const [isFindingLocation, setIsFindingLocation] = useState(false);

  //get the context from _app.js
  const { dispatch } = useContext(StoreContext);

  const success = (position) => {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;

    //setLatLong(`${latitude}, ${longitude}`);
    //Instead of state use reducer to set the latLong and pass it accross the app
    dispatch({
      type: ACTION_TYPE.SET_LAT_LONG,
      payload: { latLong: `${latitude}, ${longitude}` },
    });
    setLocationErrMsg("");
    setIsFindingLocation(false);
  };
  const error = () => {
    setIsFindingLocation(false);
    setLocationErrMsg("Unable to retrieve your location");
  };

  const handleTrackLocation = () => {
    setIsFindingLocation(true);
    if (!navigator.geolocation) {
      setLocationErrMsg("Geolocation is not supported by your browser");
      setIsFindingLocation(false);
    } else {
      //status.textContent = "Locating…";
      navigator.geolocation.getCurrentPosition(success, error);
    }
  };
  return { handleTrackLocation, locationErrMsg, isFindingLocation };
};

export default useTrackLocation;
