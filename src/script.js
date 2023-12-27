"use strict";
let map;
const workoutContainer = document.querySelector(".workout-container");

class workout {
  constructor(lat, lon, distance, min, speed) {
    this.lat = lat;
    this.lon = lon;
    this.distance = distance;
    this.min = min;
    this.speed = speed;
  }

  static onMapClick(e) {
    const inputForm = document.querySelector(".input-form");
    inputForm.classList.remove("hidden");

    this.lat = e.lat;
    this.lon = e.lon;
  }

  onInputEnter() {}
}

const getLocation = () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((position) => {
      let lat = position.coords.latitude;
      let lon = position.coords.longitude;

      // Setting the map
      map = L.map("map").setView([lat, lon], 13);

      L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution:
          '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }).addTo(map);

      map.on("click", (e) => {
        workout.onMapClick(e);
      });

      workoutContainer.addEventListener("change", (e) => {
        if (e.target.classList.contains("dropdown")) {
          console.log("some");
        }
      });
    });
  } else {
    prompt("could not get your location");
  }
};

document.addEventListener("DOMContentLoaded", () => {
  getLocation();
});

// make a workout class
// add properteis
// add some private properties that
//
