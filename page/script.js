const textContainer = document.querySelector(".test-container");
const validChars = /^[a-zA-Z-.,;:'"!?()\[\]{}\s]$/;
const timerEl = document.querySelector("#timer");
const wpmEl = document.querySelector("#wpm");
const accuracyEl = document.querySelector("#accuracy");
const resetBtn = document.querySelector("#reset-btn");

const DEFAULT_STATE = {
  started: false,
  finished: false,
  currentChar: 0,
  wpm: 0,
  correct: 0,
  incorrect: 0,
  accuracy: 0,
  totalTime: 0,
  startTime: 0
}

let state = DEFAULT_STATE;

//TODO: Change how it works for mobile

async function reset() {
  state = DEFAULT_STATE;
  resetBtn.innerText = "...";
  await init();
  resetBtn.innerText = "Reset";
}

async function init() {
  window.setInterval(update_stats, 100);
  textContainer.style.display = "none";
  // Get text from local file: text.txt and call generateText with it
  await fetch("./test.txt")
    .then((response) => response.text())
    .then((data) => {
      clearText();
      generateText(data);
    });
  resetStats();
  indicateLoaded();
  textContainer.style.display = "block";
}

function indicateLoaded() {
  textContainer.style.animation = 'none';
  textContainer.offsetHeight;
  textContainer.style.animation = 'flash-border 0.5s';
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
  if (set_finished()) return;
  // Make sure spacebar doesn't scroll the page
  if (event.key === " ") event.preventDefault();

  // Undo
  if ("Backspace" == key) {
    if (state.currentChar > 0) {
      state.currentChar--;
      charClasses = textElements[state.currentChar].classList;
      // Update the number of correct/incorrect characters
      charClasses.contains("correct") ? state.correct-- : state.incorrect--;
      charClasses.remove("correct");
      charClasses.remove("incorrect");
    }
    update_accuracy();
    return;
  }
  check_key(key);
  update_accuracy();
});

function set_finished() {
  if (state.currentChar >= textContainer.children.length - 1) {
    state.finished = true;
    return;
  }
  state.finished = false;
}

function check_key(key) {
  const textElements = textContainer.children;
  if (!validChars.test(key)) {
    return;
  }
  state.started = true;
  if (key == textElements[state.currentChar].innerText) {
    textElements[state.currentChar].classList.add("correct");
    state.correct++;
  } else {
    textElements[state.currentChar].classList.add("incorrect");
    state.incorrect++;
  }
  state.currentChar++;
}

function update_accuracy() {
  state.accuracy = state.correct / (state.correct + state.incorrect);
  document.querySelector("#accuracy").innerText =
    "Accuracy: " + (state.accuracy * 100).toFixed(0) + "%";
}

function update_timer() {
  if (!state.started) {
    startTime = (new Date()).getTime();
    return;
  }
  // console.log("updating");
  state.totalTime = (((new Date()).getTime() - startTime) / 1000);
  timerEl.innerText = "Time: " + state.totalTime.toFixed(1)  + "s";
}

function update_wpm() {
  if (!state.started) return;
  state.wpm = (state.correct / 5) / (state.totalTime / 60);
  wpmEl.innerText = "WPM: " + state.wpm.toFixed(0);
}

function update_stats() {
  if (state.finished) return;
  update_timer();
  update_wpm();
}

function resetStats() {
  accuracyEl.innerText = "Accuracy: 100%";
  wpmEl.innerText = "WPM: 0";
  timerEl.innerText = "Time: 0s";
}

window.onload = init;
