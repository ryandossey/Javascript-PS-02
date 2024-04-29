'use strict';

import { wordleWords } from "./wordle-list.js";
import { fullList } from "./full-list.js";

// globals
let wordleWord = [];
let currentGuess = [];
const currentTile = {
    row: 1,
    tile: 1,
};

function main() {
    // set up interface
    createTiles();
    createKeys();

    // choose wordle
    chooseWord();

    // Add event listeners on keys and keyboard
    document.querySelectorAll('.key').forEach((key) => {
        key.addEventListener('click', keyClicked);
    });

    window.addEventListener('keydown', (event) => {
        let regex = /^[a-zA-Z]+$/;
        if (event.key === 'Escape') {
            console.log('ESCAPE KEY:', event.key);
        } else if (event.key === 'Enter') {
            console.log('ENTER KEY:', event.key);
            checkGuess();
        } else if (event.key === 'Backspace') {
            console.log('BACKSPACE KEY:', event.key);
            backSpace();
        } else if (
            regex.test(event.key) &&
            event.key != 'Shift' &&
            event.key != 'Alt' &&
            event.key != 'Meta' &&
            event.key != 'Tab' &&
            event.key != 'Control' &&
            event.key != 'CapsLock' &&
            !event.key.includes('Arrow')
        ) {
            console.log('ALPHABET KEY:', event.key);
            buildGuess(event.key);
        } else {
            console.log('not a valid key');
        }
    });
}

main();

// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
//  FUNCTIONALITY
// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *

/**
 * Randomly chooses a word from the official wordle choices list
 * @returns {array} wordleWord (sets global)
 */
function chooseWord() {
    let randomIndex = Math.floor(Math.random() * wordleWords.length);
    wordleWord = wordleWords[`${randomIndex}`].split('');
    console.log(wordleWord);
}
/**
 * Handles when a (interface) key is clicked
 * @param {object} event
 */
function keyClicked(event) {
    let currentKey = event.currentTarget.id;

    switch (currentKey) {
        case 'Enter':
            console.log('ENTER TILE:', currentKey);
            checkGuess();
            break;

        case 'BackSpace':
            console.log('BACKSPACE TILE:', currentKey);
            backSpace();
            break;

        default:
            console.log('ALPHABET TILE:', event.currentTarget.id);
            buildGuess(event.currentTarget.id);
            break;
    }
}

// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
//  MAKE A GUESS: ADD A LETTER
// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
/**
 * Creates an array of 5 letters = a guessed word
 * @param {string} letter
 */
function buildGuess(letter) {
    if (currentGuess.length < 5) {
        currentGuess.push(letter);
        addTile(letter);
    }
}
/**
 * Updates a tile to add a letter to the interface when an interface key is selected
 * @param {string} letter
 */
function addTile(letter) {
    let row = document.querySelector(`#row-${currentTile.row}`);
    let tile = row.querySelector(`[data-tile="${currentTile.tile}"]`);
    tile.textContent = letter.toUpperCase();
    tile.classList.add('active');
    currentTile.tile += 1;
}
// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
//  MAKE A GUESS: REMOVE A LETTER
// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
/**
 * Handles when the backspace key is clicked - removes a tile and a letter in guessed word
 */
function backSpace() {
    if (currentGuess.length > 0) {
        currentGuess.pop();
        deleteTile();
    }
}
/**
 * Updates a tile to remove a letter from the interface keys
 */
function deleteTile() {
    currentTile.tile -= 1;
    let row = document.querySelector(`#row-${currentTile.row}`);
    let tile = row.querySelector(`[data-tile="${currentTile.tile}"]`);
    tile.textContent = '';
    tile.classList.remove('active');
}

// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
//  MAKE A GUESS: CHECK THE GUESS
// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
/**
 * Checks if a guessed word is valid, and if so sends it to be evaluated
 * Note: evaluateWord(array) takes an array based off the guessed word
 */
function checkGuess() {
    if (currentGuess.length < 5) {
        document.querySelector('.notice').textContent = 'Not enough letters.';
        document.querySelector('.notice').classList.add('open');
        setTimeout(() => {
            document.querySelector('.notice').classList.remove('open');
        }, 1500);
    } else {
        if (isValid(currentGuess)) {
            // @TO-DO: evaluate the guess against the Wordle word
            console.log('Ready to evaluate', currentGuess);
            evaluateGuess();
        } else {
            document
                .querySelector(`#row-${currentTile.row}`)
                .classList.add('shake');
            document.querySelector('.notice').textContent = 'Not a word.';
            document.querySelector('.notice').classList.add('open');
            setTimeout(() => {
                document.querySelector('.notice').classList.remove('open');
            }, 1500);
        }
    }
}

// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
//  Pracitce 2: Evaluate wordle guess
// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
/**
 * Evaluates a guessed word letter by letter to see if it is correct, present or absent
 * @param {array} currentWordArray (needs access to this global)
 */
 function evaluateGuess() {
       
    // Make a copy of both the current wordle word and the current guess
    let worlde = [...wordleWord];
    let guess = [...currentGuess];
    // starting values
    let resultArray = ['absent', 'absent', 'absent', 'absent', 'absent'];
    let wordleGuessed = true;

    // code to update resultArray as we evalute the guess
    // result will be based on if it's all correct or not

    for (let i = 0; i < guess.length; i++) {
        if (guess[i] === worlde[i]) {
            resultArray.push('correct');
            worlde[i] = null; // Mark the corresponding letter in the Wordle word as used
        } else if (worlde.includes(guess[i])) {
            resultArray.push('present');
            wordleGuessed = false; // If a letter is present but not in the correct position, wordle is not completely guessed
        } else {
            resultArray.push('absent');
            wordleGuessed = false; // If a letter is absent, wordle is not completely guessed
        }
    }

    return { resultArray, wordleGuessed }; // Return both resultArray and the flag indicating if the Wordle word is completely guessed
}

    updateDisplay(resultArray, result);
    handleResult(result);

/**
 * Update display after word guessed
 * @param {array} resultArray
 * @param result
 */
 function updateDisplay(resultArray, result) {
 // Change color of the tiles
    const rows = document.querySelectorAll('.tiles > div');
    rows.forEach((row, index) => {
        const tiles = row.querySelectorAll('.tile');
        tiles.forEach((tile, i) => {
            tile.classList.remove('correct', 'present', 'absent');
            if (resultArray[index] === 'correct' && i < resultArray.length) {
                tile.classList.add('correct');
            } else if (resultArray[index] === 'present' && i < resultArray.length) {
                tile.classList.add('present');
            } else if (resultArray[index] === 'absent' && i < resultArray.length) {
                tile.classList.add('absent');
            }
        });
    });

    // Change color of the keys
    const keys = document.querySelectorAll('.keys .key');
    keys.forEach((key) => {
        const letter = key.textContent;
        if (currentGuess.includes(letter)) {
            key.classList.add('used');
        } else {
            key.classList.remove('used');
        }
    });
        
 }

/**
 * Determines if we are still playing or game is over (won or lost)
 * @param result
 */
 function handleResult(result) {
    // did the user guess the wordle? - game over - module
    // did the user use up their last row? - game over - module
    // OR did we go on to the next guess
    const isWordleGuessed = resultArray.every((result) => result === 'correct');
    const isLastRowUsed = currentTile.row === 6;

    if (isWordleGuessed) {
        gameOver('You guessed the Wordle! 🎉');
    } else if (isLastRowUsed) {
        gameOver('You used up all your guesses. The Wordle was not guessed.');
    } else {
        // Proceed to the next guess
        resetInterfaceForNextGuess();
    }
}


/**
 * Determines if the current guess is a word recognized as a guess by Wordle
 * @param {array} currentWord
 * @returns {boolean}
 */
function isValid(currentWord) {
    return fullList.find((word) => word == currentWord.join(''));
}

// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
//  CREATE INTERFACE
// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
/**
 * Creates six rows of file tiles each for the interface
 */
function createTiles() {
    let html = '';

    for (let i = 1; i <= 6; i++) {
        html += `<div id='row-${i}' class='row-${i}'>\n`;
        for (let j = 1; j <= 5; j++) {
            html += `<div class='tile' data-tile='${j}'></div>`;
        }
        html += '\n</div>';
    }

    document.querySelector('#tiles').insertAdjacentHTML('afterbegin', html);
}
/**
 * Creates three rows of keyboard keys as interface elements
 */
function createKeys() {
    const qwerty = [
        ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
        ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
        [
            'ENTER',
            'Z',
            'X',
            'C',
            'V',
            'B',
            'N',
            'M',
            `<span class="material-symbols-outlined">backspace</span>`,
        ],
    ];
    let html = '';

    for (const row of qwerty) {
        html += `<div id='row-${qwerty.indexOf(row)}' class='row-${qwerty.indexOf(row)}'>\n`;
        for (const key of row) {
            if (key == 'ENTER') {
                html += `<div id="Enter" class="key enter">${key}</div>`;
            } else if (key.length > 1) {
                html += `<div id="BackSpace" class="key">${key}</div>`;
            } else {
                html += `<div id="${key.toLowerCase()}" class="key">${key}</div>`;
            }
        }
        html += '\n</div>';
    }

    document.querySelector('#keys').insertAdjacentHTML('beforeend', html);
}

