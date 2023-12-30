"use strict";

const Container = document.querySelector(".container");
const inputForm = document.querySelector(".input-form");
const workoutsContainer = document.querySelector(".workouts-container");
let map;
let workouts = [];

const makeWorkouts = function (date, type, distance, duration, exercise) {
  console.log(date);
  const day = date.getDate();
  const monthName = date.toLocaleString("default", { month: "long" });

  const html = `
  <div class="mb-7 grid cursor-pointer flex-col gap-x-6 gap-y-3 rounded-md border-l-[5px] ${
    type === "running" ? "border-brand--2" : "border-brand--1"
  }  bg-dark--2 px-6 py-6 md:grid-cols-4">
    <h2 class="col-start-1 col-end-[-1] text-[1.2rem] font-semibold">
      ${type === "running" ? "Running" : "Cycling"} on ${monthName} ${day}
    </h2>
    <div class="flex flex-wrap gap-x-4 md:flex-nowrap">
      <div class="flex items-center">
        <p>${type === "running" ? "🏃‍♂️" : "🚴‍♀️"}</p>
        <span class="mr-1 text-[0.9rem]">${distance}</span>
        <span class="text-[0.8rem] font-extrabold uppercase text-light--1">km</span>
      </div>
      <div class="flex items-center">
        <p class="mr-[0.1rem]">⏱</p>
        <span class="mr-1 text-[0.9rem]">${duration}</span>
        <span class="text-[0.8rem] font-extrabold uppercase text-light--1">duration</span>
      </div>
      <div class="flex items-center">
        <p class="mr-[0.1rem]">⚡️</p>
        <span class="mr-1 text-[0.9rem]">${Math.trunc(
          distance / duration,
        )}</span>
        <span class="text-[0.8rem] font-extrabold uppercase text-light--1">MIN/KM</span>
      </div>
      ${
        type === "running"
          ? `<div class="flex items-center">
              <p class="mr-[0.1rem]">🦶🏼</p>
              <span class="mr-1 text-[0.9rem]">${exercise}</span>
              <span class="text-[0.8rem] font-extrabold uppercase text-light--1">SPM</span>
            </div>`
          : `<div class="flex items-center">
              <p class="mr-[0.1rem]">⛰</p>
              <span class="mr-1 text-[0.9rem]">${exercise}</span>
              <span class="text-[0.8rem] font-extrabold uppercase text-light--1">m</span>
            </div>`
      }
    </div>
  </div>
`;

  const div = document.createElement("div");
  div.innerHTML = html;
  workoutsContainer.prepend(div);
};

class workout {
  constructor(lat, lng, distance, duration, speed) {
    this.lat = lat;
    this.lng = lng;
    this.distance = distance;
    this.duration = duration;
    this.speed = speed;
  }

  static onMapClick(e) {
    inputForm.classList.remove("opacity-0", "h-0", "-translate-y-[2rem]");
    inputForm.classList.add("mb-7", "py-6");
    document.getElementById("input-field1").focus();

    const { lat, lng } = e.latlng;
    this.lat = lat;
    this.lng = lng;
  }

  onInputEnter() {}
}

const getLocation = () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((position) => {
      let lat = position.coords.latitude;
      let lon = position.coords.longitude;

      // Setting the inital map based on user location map
      map = L.map("map").setView([lat, lon], 13);

      L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution:
          '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }).addTo(map);

      map.on("click", (e) => {
        workout.onMapClick(e);
        console.log(e.latlng);
      });
    });
  } else {
    prompt("could not get your location");
  }
};

// When type is changed in dropDown
Container.addEventListener("click", (e) => {
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

const addMarker = function (lat, lng, desc) {
  const marker = L.marker([lat, lng]).addTo(map);

  const iconDesc = desc.includes("running")
    ? `${desc.padStart(desc.length + 2, "🏃‍♂️")}`
    : `${desc.padStart(desc.length + 2, "🚴‍♀️")}`;

  marker.bindPopup(iconDesc).openPopup();
};

Container.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && e.target.classList.contains("input-field")) {
    const type = document.querySelector(".dropdown");

    let inputFields;
    // select inputFields based on the type
    if (type.value === "running") {
      inputFields = document.querySelectorAll(".input-field:not(.elven-input)");
    } else {
      inputFields = document.querySelectorAll(
        ".input-field:not(.cadence-input)",
      );
    }

    // To check if all the input values  are +ve
    let state = [];
    inputFields.forEach((field) => {
      if (field.value >= 1) {
        state.push(true);
      } else {
        state.push(false);
      }
    });

    console.log(state);
    if (!state.includes(false)) {
      const [distance, duration, exercise] = inputFields;
      const date = new Date();
      makeWorkouts(
        date,
        type.value,
        distance.value,
        duration.value,
        exercise.value,
      );

      // add hidden classes
      inputForm.classList.add("opacity-0", "h-0", "-translate-y-[2rem]");
      inputForm.classList.remove("mb-7", "py-6");

      addMarker(workout.lat, workout.lng, "cycling on December2");
      // details object
      const typeProperty =
        type.value === "running"
          ? { cadence: exercise.value }
          : { elvenGain: exercise.value };

      const details = {
        type: type.value,
        distance: distance.value,
        duration: duration.value,
        date: new Date(),
        corrdinates: [workout.lat, workout.lng],
      };

      const allDetails = { ...typeProperty, ...details };

      workouts.push(allDetails);
      localStorage.setItem("workouts", JSON.stringify(workouts));

      // Empty all the input fields
      inputFields.forEach((field) => (field.value = ""));
    }
  }
});

document.addEventListener("DOMContentLoaded", () => {
  getLocation();

  const workouts = JSON.parse(localStorage.getItem("workouts"));
  console.log(workouts);
  workouts.forEach((w) => {
    const dateString = w.date;
    console.log(dateString);
    const date = new Date(dateString);
    const type = w.type;
    const distance = w.distance;
    const duration = w.duration;
    const exercise = w.cadence;
    const lat = w.lat;
    const lng = w.lng;

    console.log(lat);
    makeWorkouts(
      date,
      type.value,
      distance.value,
      duration.value,
      exercise.value,
    );

    addMarker(lat, lng);
  });
});

// conflix between cadence exercise
