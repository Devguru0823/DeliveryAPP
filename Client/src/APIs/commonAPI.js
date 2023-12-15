import axios from 'axios';
import {GOOGLE_PLACES_KEY} from '../config/constants';

export const getGeoLocationFromAddress = (address, onCompleted) => {
  let code = 202;
  let result = {
    message: '',
    content: null,
  };

  axios
    .get(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${GOOGLE_PLACES_KEY}`,
      {
        headers: {
          accept: 'application/json',
        },
      },
    )
    .then(response => {
      result.content = {
        lat: response.data.results[0].geometry.location.lat,
        lng: response.data.results[0].geometry.location.lng,
      };

      onCompleted(200, result);
    })
    .catch(err => {
      console.log(err);
      result.message = err.message;
      onCompleted(code, result);
    });
};

export const getGeoAddressFromLatlng = async (lat, lng, onCompleted) => {
  let code = 202;
  let result = {
    message: '',
    content: null,
  };

  let latlng = [lat.toString(), lng.toString()].join(',');

  let api_url = 'https://maps.googleapis.com/maps/api/geocode/json';

  let url = `${api_url}?latlng=${latlng}&key=${GOOGLE_PLACES_KEY}`;

  try {
    let response = await axios.get(url);

    let data = response.data;

    if (data.results?.length > 0) {
      code = 200;
      result.content = data.results[0].formatted_address;
    }
  } catch (err) {
    console.log(err.message);
    result.message = err.message;
  }

  onCompleted(code, result);
};

export const getPreviousScreenName = (navigation) => {
  const routes = navigation.getState()?.routes;
  const prevRoute = routes[routes.length - 2];
  return prevRoute?.name
};