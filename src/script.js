/*
Features:
zoom
drag
show marker
*/

// get the user location using the geolocation Api

let lat, lon;

const getLocation = () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((position) => {
      lat = position.coords.latitude;
      lon = position.coords.longitude;
    });
  } else {
    prompt("could not get your location");
  }
};

window.onload = () => {
  getLocation();
};
