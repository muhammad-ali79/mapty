"use strict";

const getLocation = () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((position) => {
      let lat = position.coords.latitude;
      let lon = position.coords.longitude;

      console.log(lat, lon);

      // Setting the map
      const mapDiv = document.querySelector(".map");

      let map = L.map(mapDiv).setView([lat, lon], 13);

      L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution:
          '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }).addTo(map);
    });
  } else {
    prompt("could not get your location");
  }
};

document.addEventListener("DOMContentLoaded", () => {
  getLocation();
});
