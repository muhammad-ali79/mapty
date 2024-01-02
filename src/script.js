const Container = document.querySelector(".container-box");
const inputForm = document.querySelector(".input-form");
const workoutsContainer = document.querySelector(".workouts-container");
let latlng;
let map;
let workouts = [];
let workoutId;

const onMapClick = function () {
  inputForm.classList.remove("opacity-0", "h-0", "-translate-y-[97px]");
  inputForm.classList.add("mb-7", "py-6");
  document.getElementById("input-field1").focus();
};

const showError = (error) => {
  const errorMessages = {
    [error.PERMISSION_DENIED]: "User denied the request for Geolocation.",
    [error.POSITION_UNAVAILABLE]: "Location information is unavailable.",
    [error.TIMEOUT]: "The request to get user location timed out.",
    [error.UNKNOWN_ERROR]: "An unknown error occurred.",
  };

  alert(errorMessages[error.code] || "An error occurred.");
};

// This wil add marker and popup
const addMarker = function (lat, lng, desc) {
  const marker = L.marker([lat, lng]).addTo(map);

  const iconDesc = desc.includes("running")
    ? `${desc.padStart(desc.length + 4, "🏃‍♂️  ")}`
    : `${desc.padStart(desc.length + 4, "🚴‍♀️  ")}`;

  marker.bindPopup(iconDesc).openPopup();
};

const getLocation = () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        let userLat = position.coords.latitude;
        let userLon = position.coords.longitude;

        // Setting the inital map based on user location map
        map = L.map("map").setView([userLat, userLon], 13);

        L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
          maxZoom: 19,
          attribution:
            '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        }).addTo(map);

        map.on("click", (e) => {
          onMapClick(e);
          latlng = e.latlng;
          console.log(e.latlng);
        });

        // For Dom Content Loaded
        workouts.forEach((w) => {
          const [lat, lng] = w.coordinates;
          addMarker(lat, lng, w.description);
        });
      },
      (error) => showError(error),
    );
  }
};

const makeWorkouts = function (date, type, distance, duration, exercise, id) {
  const formattedDate = date.toLocaleString("default", {
    month: "long",
    day: "numeric",
  });

  const workoutType = type === "running" ? "Running" : "Cycling";

  const html = `
  <div class="workout-details mb-7 grid cursor-pointer flex-col gap-x-6 gap-y-3 rounded-md border-l-[5px] ${
    type === "running" ? "border-brand--2" : "border-brand--1"
  }  bg-dark--2 px-6 py-6 md:grid-cols-4">
    <h2 class="col-start-1 col-end-[-1] text-[1.2rem] font-semibold">
      ${workoutType} on ${formattedDate}
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

  div.dataset.id = `${id}`;
  workoutsContainer.prepend(div);
};

const handleInputEnter = (e) => {
  if (e.key === "Enter" && e.target.classList.contains("input-field")) {
    const type = document.querySelector(".dropdown");

    // select inputFields based on the type
    const inputFields = document.querySelectorAll(
      type.value === "running"
        ? ".input-field:not(.elven-input)"
        : ".input-field:not(.cadence-input)",
    );

    // To check if all the input values  are +ve
    const isValidInput = Array.from(inputFields).every(
      (field) => field.value >= 1,
    );

    if (isValidInput) {
      const [distance, duration, exercise] = inputFields;
      const date = new Date();
      const desc = `${type.value} on ${date.toLocaleString("default", {
        month: "long",
        day: "numeric",
      })}`;
      workoutId = workouts.length + 1;

      // add hidden classes
      inputForm.classList.add("opacity-0", "h-0", "-translate-y-[97px]");
      inputForm.classList.remove("mb-7", "py-6");

      const { lat, lng } = latlng;

      makeWorkouts(
        date,
        type.value,
        distance.value,
        duration.value,
        exercise.value,
        workoutId,
      );

      addMarker(lat, lng, desc);

      const details = {
        type: type.value,
        distance: distance.value,
        duration: duration.value,
        date: new Date(),
        coordinates: [lat, lng],
        exercise: exercise.value,
        id: `${workoutId}`,
        description: desc,
      };

      workouts.push(details);
      localStorage.setItem("workouts", JSON.stringify(workouts));

      // Empty all the input fields
      inputFields.forEach((field) => (field.value = ""));
    }
  }
};

const onDropDownChange = (e) => {
  if (e.target.classList.contains("dropdown")) {
    const dropdown = document.querySelector(".dropdown");
    const elvenGain = inputForm.querySelector(".elven-gain");
    const cadence = inputForm.querySelector(".cadence");

    const isCycling = dropdown.value === "cycling";
    elvenGain.classList.toggle("hidden", isCycling);
    cadence.classList.toggle("hidden", !isCycling);
  }
};

const onDomLoaded = () => {
  getLocation();

  const workoutsLocalStorage = JSON.parse(localStorage.getItem("workouts"));
  workouts.push(...workoutsLocalStorage);

  workouts.forEach((w) => {
    const dateString = w.date;
    const date = new Date(dateString);
    const type = w.type;
    const distance = w.distance;
    const duration = w.duration;
    const exercise = w.exercise;
    const id = w.id;

    makeWorkouts(date, type, distance, duration, exercise, id);
  });
};

// This function will change the view
const setView = (arr, e) => {
  if (e.target.classList.contains("workout-details")) {
    const target = arr.find(
      (workout) => workout.id === e.target.parentElement.dataset.id,
    );

    const [lat, lng] = target.coordinates;
    map.setView([lat, lng], 13);
  }
};

// EventListeners
// When type is changed in dropDown
Container.addEventListener("click", (e) => onDropDownChange(e));

// when new workout is added
Container.addEventListener("keydown", (e) => handleInputEnter(e));

// on Domloaded
document.addEventListener("DOMContentLoaded", () => onDomLoaded());

workoutsContainer.addEventListener("click", (e) => {
  setView(workouts, e);
});
