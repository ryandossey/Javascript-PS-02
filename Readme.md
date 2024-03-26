# Practice 2: Wordle - Part Three

## Goal 6: Evaluate the guess

First up, let's return to function **checkGuess** and revisit how to evaluate a valid guess! Add a function called **evaluateGuess** into the logic for when the guess is both valid and the correct length. 

Remember the array _currentGuess_ is a global, so we don't have to pass it around.

### FUNCTION 1: evaluateGuess()

We want to start by making a COPY IN MEMORY of both the _guess array_ and the _wordle word array_. You can do this in several ways... see what you can find in JavaScript.info, MDN and with a general search.

If we make a copy like we do with simple variables like booleans, numbers and strings, the data is copied and placed into memory in separate locations. But with collective data types, a new variable set in this way is a pointer to only one location in memory.

HOW CAN WE MAKE A TRUE COPY (ALSO CALLED A CLONE) OF AN ARRAY? (Look up the ES6 method)

```js
let original = ['a', 'b', 'c'];
let copy = original;
copy.pop();
console.log(original);  // ['a', 'b']
console.log(copy); // ['a', 'b']
```

The reason we need to clone these arrays is because we will likely need to modify or destroy these arrays as we work with them, and because a simple reassignment to a new variable name will just make a copy of the pointer to where the array is stored in memory, we will be changing the originals too unless we make a shallow copy.

```js
/**
 * Evaluates a guessed word letter by letter to see if it is correct, present or absent
 * @param {array} currentWordArray (needs access to this global)
 */
function evaluateGuess() {
    // Make a copy of both the current wordle word and the current guess

}
```

### Algorithm for Wordle Evaluation

The basic evaluation is straightforward. Because you don't have to worry about keeping track of which letters turned yellow (match but not in the right position) or green (match in the correct position) from guess to guess (row to row), we really just need to compare _currentGuess_ and _wordleWord_.

BASIC ALGORITHM: Compare each letter in the guess (_currentGuess_) array to the letter with the same position in the wordle (_wordleWord_) array. Keep track of the result, and change the interface to reflect the outcome. Then decide if we go to the next row for another guess, or if the game is over.

-   **CORRECT:** letter in guess and wordle match - tile and key turn _green_
-   **PRESENT:** letter in guess is present in the wordle, but not in the same position - tile and key turn _yellow_
-   **ABSENT:** letter in the guess does not match any of the letters in the wordle - tile and key turn _grey_

Assume that in addition to clones of the wordle and guess arrays, you will also need access to an array to keep track of the results:

```js
// starting values
let resultArray = ['absent', 'absent', 'absent', 'absent', 'absent'];
```

#### Write an algorithm for this test

-   Wordle word: SMART 
-   Guess word: STORE

![wordle test 1](./images/store.png 'wordle test 1')

#### Double letters in the wordle

Will our algorithm work when we have two letters that repeat in the wordle word?

-   Wordle word: ARRAY
-   Guess word: GRASP

![wordle test 2](./images/grasp.png 'wordle test 2')

#### Double letters in the guess
Will our algorithm work when we have two letters that repeat in the guess word?

-   Wordle word: SMART
-   Guess word: ARRAY

![wordle test 3](./images/array.png 'wordle test 3')

#### Double letters in both

And finally, here we have two letters that repeat in the wordle word, and also two letters that repeat in the guess word.

-   Wordle word: START
-   Guess word: STATS

![wordle test 4](./images/stats.png 'wordle test 4')

#### Triple letters?

Of course, our algorithm should also deal with triple letters in a word.

-   Wordle word: ERROR
-   Guess word: GEESE

![wordle test 5](./images/geese.png 'wordle test 5')

##### What we need by the end of this function

1. We need _resultArray_ to represent in code what our algorithm says is the result for our guess against the wordle word.

Our first example (Wordle: SMART, Guess: STORE) would result in a _resultArray_ that looks like this: **['correct', 'present', 'absent', 'correct', 'absent']**.

2. We also need some sort of **flag** saying if the wordle was completely guessed - it's up to you what this flag is.. boolean? number? string with the phrase "mic drop 🎤"? Consider writing this as a helper function.

WE WILL NEED TO PASS THESE TWO PIECES OF INFORMATION TO TWO FUNCTIONS; ONE TO HANDLE THE INTERFACE and ONE TO HANDLE THE LOGIC.

### FUNCTION 2: updateDisplay()

Just as we did before, it makes sense here to divide this into two functions. Possibly more if if makes sense for you to do so.

```js
/**
 * Update display after word guessed
 * @param {array} resultArray
 * @param result
 */
function updateDisplay(resultArray, result) {}
```

This function will take the _resultArray_, as shown here, and update the display to show grey, gold or green letter tiles and keys.

If you determine through your _result_ paramenter the user has guessed the wordle, you can optionally complete the bonus to have the tiles do an animation.

### FUNCTION 3: handleResult()

In the end, for each round (guess made), we need to know the answers to these for the logic:

1.  Is the game over? 
-   Do the words match exactly? (result parameter will tell us)
-   Are we out of guesses? (we only have 6 rows)
-   If either is true, we need to notify the user and freeze the game play by removing the event listeners on the keys.
2.  If the game is not over, then we want to set our current tile position to a new row to allow for a new guess to be made.

```js
/**
 * Determines if we are still playing or game is over (won or lost)
 * @param result
 */
function handleResult(result) {}
```    

## Goal 7: Add some animation

The last step is to go back and really evaluate that the interface gives the feedback you need to give for the user to understand what happens. Sometimes it's essential (what we've done so far), and sometimes, it just really helps to make the point that something is correct, incorrect, or needs their attention.

### Modal
-   When the game is over, OPEN A MODAL and display a message saying the game is over, how well the user did, and what the wordle word was (remember we need this because the game could end because the user ran out of guesses)
-   When the user clicks outside of the modal, CLOSE THE MODAL
-   When the keyboard key 'ESCAPE' is pressed, CLOSE THE MODAL

```css
/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
    MODAL - notice .open already exists under NOTICE - delete that one, keep this one
* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
.modal-outer {
    display: grid;
    background: rgba(237, 237, 237, 0.7);
    position: fixed;
    height: 100vh;
    width: 100vw;
    top: 0;
    left: 0;
    justify-content: center;
    align-items: center;
    opacity: 0;
    transition: opacity 0.2s;
    /* Hide this modal until we need it */
    pointer-events: none;
}

.modal-inner {
    max-width: 600px;
    min-width: 400px;
    padding: 2rem;
    border-radius: 6px;
    min-height: 200px;
    background: white;
    box-shadow: 1px 1px 1px lightgrey;
}

.modal-outer.open .modal-inner {
    transform: translateY(0);
}

/* needs to be at the end of the modal / notice CSS section */
.open {
    opacity: 1;
    pointer-events: all;
}
```

### Hard Mode (BONUS +3)

Enable a HARD MODE in your Wordle game. Hard mode means that the user MUST USE any green letters found in one row in subsequent guesses / rows. This makes the game much harder because you can't guess a new word unless all matching characters are included in place.

-   Wordle word: ARENA
-   Guess word: GREAT

![wordle test 6 for bonus](./images/great.png 'wordle bonus')

The next guess MUST INCLUDE the "R" and "E". (Doesn't necessarily have to include the "A") So "READY" won't work, but "FRESH" or "BREAK" are valid next guesses.

### Animations (BONUS +2)
-   If the guess is not a word, SHAKE the row containing the user's guess. To do this, add the class _shake_. It will play the animation only once.
-   If the guess is an exact match for the wordle, have each tile jump in turn. Use the animation class 'animation-bounce' for this effect.


```css
/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
    ANIMATIONS
* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
.shake {
    animation: shake 0.82s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
    transform: translate3d(0, 0, 0);
    backface-visibility: hidden;
    perspective: 1000px;
}

@keyframes shake {
    10%,
    90% {
        transform: translate3d(-1px, 0, 0);
    }

    20%,
    80% {
        transform: translate3d(2px, 0, 0);
    }

    30%,
    50%,
    70% {
        transform: translate3d(-4px, 0, 0);
    }

    40%,
    60% {
        transform: translate3d(4px, 0, 0);
    }
}
.animation-bounce {
    animation-name: bounce;
    animation-duration: 0.4s;
}
@keyframes bounce {
    0% {
        transform: translateY(0);
    }
    35% {
        transform: translateY(-30px);
    }
    100% {
        transform: translateY(0);
    }
}

```