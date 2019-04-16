let GAME = {
    deck: document.querySelector(".deck"),
    cardsToShuffle: Array.from(document.querySelectorAll(".card")),
    starsAwarded: document.querySelectorAll(".stars li"),
    openedCards: [],
    moves: 0,
    timerOff: true,
    time: 0,
    timerId: null,
    matched: 0,
}

// HELPERS
//*Pass shuffle function in newly created array from .card element. Result stored in shuffledCards.*//
//*Append shuffled card to deck, add to DOM - changing order of original object*//
function shuffleDeck() {
    const shuffledCards = shuffle(GAME.cardsToShuffle);
    for (card of shuffledCards) {
        GAME.deck.appendChild(card);
    }
}

//* Shuffle function from http://stackoverflow.com/a/2450976*//
function shuffle(array) {
    var currentIndex = array.length,
        temporaryValue,
        randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

//*Function to start timer*//
function startTimer() {
    GAME.timerId = setInterval(() => {
        GAME.time++;
        showTime();
    }, 1000);
}

//Show time using built in Match function to round down decimals and show seconds in correct format.*//
function showTime() {
    const timer = document.querySelector(".timer");
    const minutes = Math.floor(GAME.time / 60);
    const seconds = GAME.time % 60;

    if (seconds < 10) {
        timer.innerHTML = `${minutes}:0${seconds}`;
    } else {
        timer.innerHTML = `${minutes}:${seconds}`;
    }
}

/* Function to display the open cards on the page*/
function flipCard(card) {
    card.classList.toggle("open");
    card.classList.toggle("show");
}

/* Function to add card to a list of opened cards */
function addOpenCard(card) {
    GAME.openedCards.push(card);
}

//*Function to check if 2 opened cards match and reset after a certain amount of time if they don't. once they all match,execute endGame*//
function checkOpenCards() {
    const total_Matches = 8;

    if (
        GAME.openedCards[0].firstElementChild.className ===
        GAME.openedCards[1].firstElementChild.className
    ) {
        GAME.openedCards[0].classList.toggle("match");
        GAME.openedCards[1].classList.toggle("match");
        GAME.openedCards = [];
        GAME.matched++;
        if (GAME.matched === total_Matches) {
            endGame();
        }
    } else {
        setTimeout(() => {
            flipCard(GAME.openedCards[0]);
            flipCard(GAME.openedCards[1]);
            GAME.openedCards = [];
        }, 1000);
    }
}

//*Function to increment the move counter and modify moves HTML to show new total moves based on increment*//
function incrementMove() {
    GAME.moves++;
    const movesCounter = document.querySelector(".moves");
    movesCounter.innerHTML = `Moves: ${GAME.moves}`
}

//*Function to check score based on how many moves were made and remove star at specified intervals*//
function checkScore() {
    if (GAME.moves === 7 || GAME.moves === 12) {
        loseStar();
    }
}

//*Function to disappear star that will be run within checkScore function*//
function loseStar() {
    for (star of GAME.starsAwarded) {
        if (star.style.display !== "none") {
            star.style.display = "none";
            break;
        }
    }
}

//*Function to stop time*//
function stopTimer() {
    clearInterval(GAME.timerId);
}

function endGame() {
    stopTimer();
    toggleModal();
    showModalScoreboard();
}

//*Function to show and hide modal popup that will be called in other functions*//
function toggleModal() {
    const modal = document.querySelector(".modal-background");
    modal.classList.toggle("hide");
}

//Ccounts # of stars achieved and return #*//
function getStars() {
    starCount = 0;
    for (star of GAME.starsAwarded) {
        if (star.style.display !== "none") {
            starCount++;
        }
    }
    return starCount;
}

//*Data to be displayed on Modal, modify HTML to present gathered time, score, moves, stars.*//

function showModalScoreboard() {
    const timeStat = document.querySelector(".modal-time");
    const recordedTime = document.querySelector(".timer").innerHTML;
    const movesNeeded = document.querySelector(".modal-moves");
    const starsAchieved = document.querySelector(".modal-stars");
    const stars = getStars();

    starsAchieved.innerHTML = `Stars Achieved = ${stars}`;
    timeStat.innerHTML = `Recorded Time = ${recordedTime}`;
    movesNeeded.innerHTML = `Moves Needed = ${GAME.moves}`;
}

//*Function to hide modal and reset Game*//
function replayGame() {
    resetGame();
    toggleModal();
}

//*Resets all aspects of game (Moves to 0, time to 00:00, stars to 3) and shuffles deck*//
function resetGame() {
    resetTimerandDisplay();
    resetMoves();
    resetStars();
    resetCards();
    shuffleDeck();
}


//*Stops time, resets and displays as 0*//
function resetTimerandDisplay() {
    stopTimer();
    GAME.timerOff = true;
    GAME.time = 0;
    showTime();
}


//*Function so moves reset and display as 0*//
function resetMoves() {
    GAME.moves = 0;
    document.querySelector(".moves").innerHTML = "Moves: " + GAME.moves;

}

//*Function so stars reset and display as 3 stars*//
function resetStars() {
    for (star of GAME.starsAwarded) {
        star.style.display = "inline";
    }
}

//*Function to reset cards to default, not show*//
function resetCards() {
    const cards = document.querySelectorAll(".deck li");
    for (let card of cards) {
        card.className = "card";
    }
    GAME.openedCards = [];
    GAME.matched = 0;
}

// GAMEPLAY
shuffleDeck();
/* set up the event listener for a card. If a card is clicked:
 * display the card's symbol (put this functionality in another function that you call from this one)
 * add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 * if the list already has another card, check to see if the two cards match
 * if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 * if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)*
 * call function to increment moves counter when both cards are flipped
 */

GAME.deck.addEventListener("click", event => {
    const card = event.target;
    if (
        card.classList.contains("card") &&
        !card.classList.contains("match") &&
        GAME.openedCards.length < 2 &&
        !GAME.openedCards.includes(card)
    ) {
        if (GAME.timerOff) {
            GAME.timerOff = false;
            startTimer();
        }
        flipCard(card);
        addOpenCard(card);
        if (GAME.openedCards.length === 2) {
            checkOpenCards();
            incrementMove();
            checkScore();
        }
    }
});

//*Listens and calls for replay and return*//
document.querySelector(".modal_return").addEventListener("click", () => {
    toggleModal();
});

document.querySelector(".modal_replay").addEventListener("click", replayGame);

//*Calls reset function upon selection of restart class*//
document.querySelector(".restart").addEventListener("click", resetGame);
