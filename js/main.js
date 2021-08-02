var weightForm = document.getElementById("weight-form");
var mealForm = document.getElementById("meal-form");

var alertElement = document.getElementById("alert")

weightForm.onsubmit = (e) => {
  e.preventDefault();
  var weightElement = document.getElementById("weight-input-weight");

  // submit values
  fetch("/api/weight", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      weight: weightElement.value
    })
  });

  console.log(alertElement.classList.add("show"));
  window.setTimeout(() => alertElement.classList.remove("show"), 1000);
  weightElement.value = "";
}

mealForm.onsubmit = (e) => {
  e.preventDefault();
  var caloriesElement = document.getElementById("meal-input-calories");
  var nameElement = document.getElementById("meal-input-name");

  fetch("/api/meal", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      name: nameElement.value,
      calories: caloriesElement.value
    })
  });

  console.log(alertElement.classList.add("show"));
  window.setTimeout(() => alertElement.classList.remove("show"), 1000);
  caloriesElement.value = "";
  nameElement.value = "";
}