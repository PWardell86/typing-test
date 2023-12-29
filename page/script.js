const textContainer = document.querySelector(".test-container");
const validChars = /^[a-zA-Z.,;:'"!?()\[\]{}\s]$/;
const timerEl = document.querySelector("#timer");

let started = false;
let currentChar = 0;
let wpm = 0;
let correct = 0;
let incorrect = 0;
let accuracy = 0;

const startTime = (new Date()).getTime();

let totalTime = 0;

function init() {
  // Get text from local file: text.txt and call generateText with it
  fetch("./test.txt")
    .then((response) => response.text())
    .then((data) => {
      generateText(data);
    });
}

function generateText(text) {
  let textArr = text.split("");
  let count = 0;
  textArr.forEach((el) => {
    // Using spans ensures that the text is broken inbetween words
    let textDiv = document.createElement("span");
    textDiv.id = count++;
    textDiv.innerText = el;
    textContainer.appendChild(textDiv);
  });
}

document.addEventListener("keydown", function (event) {
  const key = event.key;
  const textElements = textContainer.children;

  // Make sure spacebar doesn't scroll the page
  if (event.key === " ") event.preventDefault();

  // Undo
  if ("Backspace" == key) {
    if (currentChar > 0) {
      currentChar--;
      charClasses = textElements[currentChar].classList;
      // Update the number of correct/incorrect characters
      charClasses.contains("correct") ? correct-- : incorrect--;
      charClasses.remove("correct");
      charClasses.remove("incorrect");
    }
    update_accuracy();
    return;
  }
  check_key(key);
  update_accuracy();
  // TODO: WPM
});

function check_key(key) {
  const textElements = textContainer.children;
  if (!validChars.test(key)) {
    return;
  }
  started = true;
  if (key == textElements[currentChar].innerText) {
    textElements[currentChar].classList.add("correct");
    correct++;
  } else {
    textElements[currentChar].classList.add("incorrect");
    incorrect++;
  }
  currentChar++;
  //TODO: Make this work properly when pressing backspace
}

function update_accuracy() {
  accuracy = correct / (correct + incorrect);
  document.querySelector("#accuracy").innerText =
    "Accuracy: " + (accuracy * 100).toFixed(0) + "%";
}

function update_timer() {
  if (!started) {
    return;
  }
  console.log("updating");
  totalTime = (((new Date()).getTime() - startTime) / 1000);
  timerEl.innerText = "Time: " + totalTime.toFixed(1)  + "s";
}

function update_wpm() {
  wpm = (correct / 5) / (totalTime / 60);
  // console.log(correct / 5);
  console.log(totalTime / 60)
  document.querySelector("#wpm").innerText = "WPM: " + wpm.toFixed(0);
}

function update_stats() {
  update_timer();
  update_wpm();
}
window.setInterval(update_stats, 100);
window.onload = init;
