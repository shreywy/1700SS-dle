'use strict';


//global vars
//keys
const BACKSPACE_KEY = 'Backspace';
const ENTER_KEY = 'Enter';
//other
const MAX_ATTEMPTS = 6;
const history = [];
let currentWord = '';

const WORD_LIST = [ 'SHREY', 'KARAN', 'KEVIN', 'ENRIK', 
                    'ETHAN', 'MEHEE', 'MEGAS', 'BIGGS',
                    'GABBY', 'LIAMS', 'ERZUM', 'GREEK',
                    'ROHAN', 'BRYCE', 'BALLIN', 'ARJUN',
                    'CHRIS', 'CLYDE', 'DRAKE', 'JOHAR',
                    'KATHY', 'JUMPY', 'ZEEES', 
                    'MUDAE', 'RYTHM', 'LIMES', 
                    'ANIME', 'MANGA', 'SKULL', 
                    'EMOJI', 'EMANS', 'JARED']

const WORD_OF_THE_DAY = WORD_LIST[Math.floor(Math.random() * WORD_LIST.length)];

// setup everything on start
const init = () => {
    console.log('Welcome to 1700s Sea Shanties-dle!');

    // make kb
    const KEYBOARD_KEYS = [ 'QWERTYUIOP', 'ASDFGHJKL', 'ZXCVBNM' ]

    // grab boards
    const gameBoard = document.querySelector('#board');
    const keyboardBoard = document.querySelector('#keyboard');

    // generate boards  
    generateBoard(gameBoard);
    generateBoard(keyboardBoard, 3, 10, KEYBOARD_KEYS, true);

    // make event listeners
    document.addEventListener('keydown', event => onKeyDown(event.key));
    keyboard.addEventListener('click', onKeyboardButtonClick);
    gameBoard.addEventListener('animationend', event =>  {
        event.target.setAttribute('data-animation', 'idle');
    });

}

const switchTheme = () => {
    
    const checkbox = document.querySelector('#theme-switch');
    var r = document.querySelector(':root');

    if (checkbox.checked == true) {
        console.log('Switching theme to light.');
        r.style.setProperty('--color-black', '#fff2e2');
        r.style.setProperty('--color-white', '#554941');
        r.style.setProperty('--color-green', '#9dba9b');
        r.style.setProperty('--color-yellow', '#b9b18f');
        r.style.setProperty('--color-gray-dark', '#9b867b');
        r.style.setProperty('--color-gray-light', '#d7b7a65f');
        r.style.setProperty('--color-tag', '#3A3A3C');
        r.style.setProperty('--color-hover', ' #bfa99d');

    } else {
        console.log('Switching theme to dark.');
        r.style.setProperty('--color-black', '#121213');
        r.style.setProperty('--color-white', '#fff');
        r.style.setProperty('--color-green', '#538d4e');
        r.style.setProperty('--color-yellow', '#B59F3B');
        r.style.setProperty('--color-gray-dark', '#3A3A3C');
        r.style.setProperty('--color-gray-light', '#626465');
        r.style.setProperty('--color-tag', '#fff2e2');
        r.style.setProperty('--color-hover', ' ##3A3A3C');
    }

};

const generateBoard = (board, rows = 6, columns = 5, keys = [], keyboard = false) => {
    for (let row = 0; row < rows; row++) {
        const elmRow = document.createElement('ul');

        elmRow.setAttribute('data-row', row);

        for (let column = 0; column < columns; column++) {
            const elmColumn = document.createElement('li');

            elmColumn.setAttribute('data-status', 'empty');
            elmColumn.setAttribute('data-animation', 'idle');

            if (keyboard && keys.length > 0) {
                const key = keys[row].charAt(column);
                elmColumn.textContent = key;
                elmColumn.setAttribute('data-key', key);
            }

            if (keyboard && elmColumn.textContent === '') {
                continue
            }

            elmRow.appendChild(elmColumn);

        }

        board.appendChild(elmRow);
    }

    if (keyboard) {
        const enterKey = document.createElement('li');
        enterKey.setAttribute('data-key', ENTER_KEY) 
        enterKey.textContent = ENTER_KEY;
        board.lastChild.prepend(enterKey);

        const backspaceKey = document.createElement('li');
        backspaceKey.setAttribute('data-key', BACKSPACE_KEY)
        backspaceKey.textContent = BACKSPACE_KEY;
        board.lastChild.append(backspaceKey);
    }
 }

 const onKeyboardButtonClick = (event) => {
    if (event.target.nodeName === 'LI') {
      onKeyDown(event.target.getAttribute('data-key'));
    }
}

 const onKeyDown = (key) => {
    // no infinite guesses
    if (history.length >= MAX_ATTEMPTS) {
        return;
    }

    if (currentWord.length >= 5 && key !== BACKSPACE_KEY && key !== ENTER_KEY) {
        return;
    }

    // find active row
    const currentRow = document.querySelector(`#board ul[data-row='${history.length}']`);

    let targetColumn = currentRow.querySelector(`li[data-status='empty']`);

   

    // uppercase letter and validate, then add
    const upperCaseLetter = key.toUpperCase();

    if (/^[A-Z]$/.test(upperCaseLetter)) {
        currentWord += upperCaseLetter;

        targetColumn.textContent = upperCaseLetter;
        targetColumn.setAttribute('data-status', 'filled');
        targetColumn.setAttribute('data-animation', 'pop');
    }

    //remove letter
    if (key === BACKSPACE_KEY) {
        if (targetColumn === null) {
            targetColumn = currentRow.querySelector(`li:last-child`);
        } else {
            targetColumn = targetColumn.previousElementSibling ?? targetColumn;
        }

        targetColumn.textContent = '';
        targetColumn.setAttribute('data-status', 'empty');  
        
        currentWord = currentWord.slice(0, -1);
        return;
    }

    if (key === ENTER_KEY) {
        if (currentWord.length < 5) { 
            showMessage("The word should be 5 letters long.");
            return;
        }

        if (currentWord.length == 5 && WORD_LIST.includes(currentWord)) {
            checkGuess(currentWord, WORD_OF_THE_DAY);
        } else {
            currentRow.setAttribute('data-animation', 'invalid');
            showMessage("The word aint in the words list.");
        }

        return;

    }

     // limit letters
    if (currentWord.length >= 5) {
        return;
    }
    
 }

 const showMessage = (message) => {
    const toast = document.createElement('li');

    toast.textContent = message;
    toast.className = 'toast';

    document.querySelector('.toaster ul').prepend(toast);

    setTimeout(() => toast.classList.add('fade'), 1000);

    toast.addEventListener('transitionend', (event) => event.target.remove());
 };

 const checkGuess = (guess, word) => {
    const guessLetters = guess.split('');
    const wordLetters = word.split('');
    const remainingWordLetters = [];
    const remainingGuessLetters = [];

    const currentRow = document.querySelector(`#board ul[data-row='${history.length}']`);
    
    currentRow.querySelectorAll('li').forEach((element, index) => {
        element.setAttribute('data-status', 'none');
        element.setAttribute('data-animation', 'flip');

        element.style.animationDelay = `${index * 300}ms`;
        element.style.transitionDelay = `${index * 400}ms`;
    });

    //shows correct letters
    wordLetters.forEach((letter, index) => {
        if (guessLetters[index] === letter) {
          currentRow.querySelector(`li:nth-child(${index + 1})`)
            .setAttribute('data-status', 'valid');
    
          document
            .querySelector(`[data-key='${letter}']`)
            .setAttribute('data-status', 'valid');
          
            remainingWordLetters.push(false);
            remainingGuessLetters.push(false);
        } else {
          remainingWordLetters.push(letter);
          remainingGuessLetters.push(guessLetters[index]);
        }
      });

    //shows correct letters but in wrong position
    remainingWordLetters.forEach((letter) => {
        if (letter === false) {
            return;
        }

        if (remainingGuessLetters.indexOf(letter) !== -1) {
            const column = currentRow.querySelector(`li:nth-child(${remainingGuessLetters.indexOf(letter) + 1})`);
            column.setAttribute('data-status', 'invalid');

            const keyboardKey = document.querySelector(`[data-key='${letter}']`);
            if (keyboardKey.getAttribute('data-status') !== 'valid') {
                keyboardKey.setAttribute('data-status', 'invalid');
            }

            remainingGuessLetters[remainingGuessLetters.indexOf(letter)] = false;
        }
    });

    guessLetters.forEach((letter) => {
        const keyboardKey = document.querySelector(`[data-key='${letter}']`);
        if (keyboardKey.getAttribute('data-status') === 'empty') {
            keyboardKey.setAttribute('data-status', 'none');
        }
    });

    history.push(currentWord);
    currentWord = '';
 }

// call init when dom is loaded, get everything set up
document.addEventListener('DOMContentLoaded', init);