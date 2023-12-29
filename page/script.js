const textContainer = document.querySelector(".test-container");
const validChars = /^[a-zA-Z.,;:'"!?()\[\]{}\s]$/;
const timerEl = document.querySelector("#timer");
const wpmEl = document.querySelector("#wpm");
const accuracyEl = document.querySelector("#accuracy");
const resetBtn = document.querySelector("#reset-btn");

let started = false;
let currentChar = 0;
let wpm = 0;
let correct = 0;
let incorrect = 0;
let accuracy = 0;

let totalTime = 0;
let startTime = 0;

async function reset() {
  started = false;
  currentChar = 0;
  wpm = 0;
  correct = 0;
  incorrect = 0;
  accuracy = 0;
  totalTime = 0;
  startTime = 0;
  resetBtn.innerText = "...";
  await init();
  resetBtn.innerText = "Reset";
}

async function init() {
  textContainer.style.display = "none";
  // Get text from local file: text.txt and call generateText with it
  await fetch("./test.txt")
    .then((response) => response.text())
    .then((data) => {
      clearText();
      generateText(data);
    });
  // Show the text container

  resetStats();
  indicateLoaded();
  textContainer.style.display = "block";
}

function indicateLoaded() {
  textContainer.style.animation = 'none';
  textContainer.offsetHeight;
  textContainer.style.animation = 'flash-border 0.4s';
}

function generateText(text) {
  let textArr = text.split("");
  let count = 0;
  textArr.forEach((el) => {
    // Using spans allowed for text to be broken inbetween words, instead of inbetween characters
    let textDiv = document.createElement("span");
    textDiv.id = count++;
    textDiv.innerText = el;
    textContainer.appendChild(textDiv);
  });
}

function clearText() {
  textContainer.innerHTML = "";
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
}

function update_accuracy() {
  accuracy = correct / (correct + incorrect);
  document.querySelector("#accuracy").innerText =
    "Accuracy: " + (accuracy * 100).toFixed(0) + "%";
}

function update_timer() {
  if (!started) {
    startTime = (new Date()).getTime();
    return;
  }
  console.log("updating");
  totalTime = (((new Date()).getTime() - startTime) / 1000);
  timerEl.innerText = "Time: " + totalTime.toFixed(1)  + "s";
}

function update_wpm() {
  if (!started) return;
  wpm = (correct / 5) / (totalTime / 60);
  wpmEl.innerText = "WPM: " + wpm.toFixed(0);
}

function update_stats() {
  update_timer();
  update_wpm();
}

function resetStats() {
  accuracyEl.innerText = "Accuracy: 100%";
  wpmEl.innerText = "WPM: 0";
  timerEl.innerText = "Time: 0s";
}

window.setInterval(update_stats, 100);
window.onload = init;
