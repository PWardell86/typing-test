

const textContainer = document.querySelector('.test-container');
const validChars = /^[a-zA-Z.,;:'"!?()\[\]{}\s]$/

let started = false;
let currentChar = 0;
let wpm = 0;
let correct = 0;
let incorrect = 0;
let accuracy = 0;

// let loremIpsum = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum";

function init() {
    // Get text from local file: text.txt and call generateText with it
    fetch('./test.txt')
        .then(response => response.text())
        .then((data) => {
            generateText(data);
        });
}

function generateText(text) {
    let textArr = text.split('');
    let count = 0;
    textArr.forEach((el) => {
        let textDiv = document.createElement('div');
        textDiv.id = count++;
        textDiv.innerText = el;
        textContainer.appendChild(textDiv);
    });
}

document.addEventListener('keydown', function(event) {
    const key = event.key;    
    const textElements = textContainer.children;

    // Make sure spacebar doesn't scroll the page
    if (event.key === ' ') event.preventDefault();

    // Undo
    if ("Backspace" == key) {
        if (currentChar > 0) {
            currentChar--;
            textElements[currentChar].classList.remove('correct');
            textElements[currentChar].classList.remove('incorrect');
        }
        return;
    }
    check_key(key);
    // TODO: WPM
});

function check_key(key) {
    const textElements = textContainer.children;
    if (!validChars.test(key)) {
        return;
    }
    if (key == textElements[currentChar].innerText) {
        textElements[currentChar].classList.add('correct');
        correct++;
    } else {
        textElements[currentChar].classList.add('incorrect');
        incorrect++;
    }
    currentChar++;
    //TODO: Make this work properly when pressing backspace
    accuracy = correct / (correct + incorrect);
    document.querySelector('#accuracy').innerText = "Accuracy: " + (accuracy * 100).toFixed(0) + '%';
}

window.onload = init;
