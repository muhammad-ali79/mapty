"use strict";

const workoutContainer = document.querySelector(".workout-container");
const inputForm = document.querySelector(".input-form");

class workout {
  constructor(lat, lon, distance, min, speed) {
    this.lat = lat;
    this.lon = lon;
    this.distance = distance;
    this.min = min;
    this.speed = speed;
  }

  static onMapClick(e) {
    inputForm.classList.remove("opacity-0", "h-0", "-translate-y-[30rem]");

    inputForm.classList.add("mb-7", "py-6");

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
      let map = L.map("map").setView([lat, lon], 13);

      L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution:
          '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }).addTo(map);

      map.on("click", (e) => {
        workout.onMapClick(e);

        console.log(e.latlng);
      });

      // To show Form
      workoutContainer.addEventListener("click", (e) => {
        if (e.target.classList.contains("dropdown")) {
          const dropdown = document.querySelector(".dropdown");
          const elvenGain = inputForm.querySelector(".elven-gain");
          const cadence = inputForm.querySelector(".cadence");

          if (dropdown.value === "cycling") {
            elvenGain.classList.remove("hidden");
            cadence.classList.add("hidden");
          } else {
            elvenGain.classList.add("hidden");
            cadence.classList.remove("hidden");
          }
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
