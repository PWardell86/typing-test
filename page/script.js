const validChars = /^[a-zA-Z-.,;:'"!?()\[\]{}\s]$/;
const textContainer = document.querySelector(".test-container");
const timerEl = document.querySelector("#timer");
const wpmEl = document.querySelector("#wpm");
const accuracyEl = document.querySelector("#accuracy");
const resetBtn = document.querySelector("#reset-btn");
const mainSection = document.querySelector("#main-section");
const loginMenuBtn = document.querySelector("#login-menu-btn");

const CORRECT = "correct";
const INCORRECT = "incorrect";
const CURRENT = "current";

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
};

let state = {...DEFAULT_STATE};

//TODO: Change how it works for mobile

async function reset() {
  state = {...DEFAULT_STATE};
  textContainer.childNodes.forEach((el) => {
    el.classList.remove(CORRECT);
    el.classList.remove(INCORRECT);
  });
  resetStats();
}

async function getNewText() {
  state = {...DEFAULT_STATE};
  await init();
}

async function login(username, password) {
  // crypto.createHash('sha1'). update(input). digest('hex');
  let data = {
    username: username,
    password: password
  };
  fetch("/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
}
async function init() {
  // Get text from local file: text.txt and call generateText with it
  await fetch("./test.txt")
    .then((response) => response.text())
    .then((data) => {
      clearText();
      generateText(data.trimEnd());
    });
  resetStats();
  textContainer.children[0].classList.add(CURRENT);
  textContainer.style.visibility = "visible";
}

function generateText(text) {
  let textArr = text.split("");
  textArr.forEach((el) => {
    // Using spans allowed for text to be broken inbetween words, instead of inbetween characters
    let textDiv = document.createElement("span");
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
  textElements[state.currentChar].classList.remove(CURRENT);
  // Make sure spacebar doesn't scroll the page
  if (event.key === " ") event.preventDefault();

  // Undo
  if ("Backspace" == key) {
    if (state.currentChar <= 0) return;
    let charClasses = textElements[state.currentChar].classList;
    // Do this before udpating the char we are on because it appears infront of the current char.
    if (state.currentChar > 1) {
      charClasses.remove(CURRENT);
      textElements[state.currentChar - 1].classList.add(CURRENT);
    }

    state.currentChar--;
    charClasses = textElements[state.currentChar].classList;
    // Update the number of correct/incorrect characters
    charClasses.contains(CORRECT) ? state.correct-- : state.incorrect--;
    charClasses.remove(CORRECT);
    charClasses.remove(INCORRECT);
    update_accuracy();
    
  } else {
    check_key(key);
    textElements[state.currentChar].classList.add(CURRENT);
    update_accuracy();
  }
  
});

function set_finished() {
  if (state.currentChar >= textContainer.children.length - 1) {
    state.finished = true;
    return true;
  }
  state.finished = false;
  return false;
}

function check_key(key) {
  const textElements = textContainer.children;
  if (!validChars.test(key)) {
    return;
  }
  
  if (!state.started) {
    state.startTime = (new Date()).getTime();
  }
  state.started = true;
  if (key == textElements[state.currentChar].innerText) {
    textElements[state.currentChar].classList.add(CORRECT);
    state.correct++;
  } else {
    textElements[state.currentChar].classList.add(INCORRECT);
    state.incorrect++;
  }
  state.currentChar++;
}

function update_accuracy() {
  if (state.correct + state.incorrect == 0) return;
  state.accuracy = state.correct / (state.correct + state.incorrect);
  document.querySelector("#accuracy").innerText =
    "Accuracy: " + (state.accuracy * 100).toFixed(0) + "%";
}

function update_timer() {
  state.totalTime = (((new Date()).getTime() - state.startTime) / 1000);
  timerEl.innerText = "Time: " + state.totalTime.toFixed(1)  + "s";
}

function update_wpm() {
  if (state.totalTime == 0) return;
  state.wpm = (state.correct / 5) / (state.totalTime / 60);
  wpmEl.innerText = "WPM: " + state.wpm.toFixed(0);
}

function update_stats() {
  // console.log(state.started, state.finished);
  if (!state.started || state.finished) return;
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
