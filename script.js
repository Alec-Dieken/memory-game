const start = document.getElementById("start");
start.addEventListener("click", function() {
  start.remove();
  startGame();
});

function startGame() {
  // Assign gameContainer and clear contents
  const gameContainer = document.getElementById("game");
  gameContainer.innerHTML = "";
  // Assign curScore and set inner text based on current # of guesses
  const curScore = document.getElementById("curScore");
  var guesses = 0;
  curScore.innerText = `Current # of guesses: ${guesses}`;
  // create array to keep track of selected cards
  var cardsShown = [];

  const COLORS = [
    "red",
    "blue",
    "green",
    "orange",
    "purple",
    "red",
    "blue",
    "green",
    "orange",
    "purple"
  ];

  // Assign bestScore h2 to var and set innerText based on whether there is a highScore in localStorage
  const bestScore = document.getElementById("bestScore");
  var highScore = localStorage.getItem("highScore") ? JSON.parse(localStorage.getItem("highScore")) : null;
  bestScore.innerText = !!highScore ? `Best # of guesses: ${highScore}` : '';
  // var to keep track of progress in game
  var points = 0;


  // here is a helper function to shuffle an array
  // it returns the same array with values shuffled
  // it is based on an algorithm called Fisher Yates if you want ot research more
  function shuffle(array) {
    let counter = array.length;

    // While there are elements in the array
    while (counter > 0) {
      // Pick a random index
      let index = Math.floor(Math.random() * counter);

      // Decrease counter by 1
      counter--;

      // And swap the last element with it
      let temp = array[counter];
      array[counter] = array[index];
      array[index] = temp;
    }

    return array;
  }

  let shuffledColors = shuffle(COLORS);

  // this function loops over the array of colors
  // it creates a new div and gives it a class with the value of the color
  // it also adds an event listener for a click for each card
  function createDivsForColors(colorArray) {
    for (let color of colorArray) {
      // create a new div
      const newDiv = document.createElement("div");

      // give it a class attribute for the value we are looping over
      newDiv.classList.add(color);
      
      // Add data-matched info to each div with a default value of "false"
      newDiv.setAttribute("data-matched", "false");
      
      // call a function handleCardClick when a div is clicked on
      newDiv.addEventListener("click", handleCardClick);

      // append the div to the element with an id of game
      gameContainer.append(newDiv);
    }
  }

  // Card click handler
  function handleCardClick(event) {
    
    // Only handle a click if the card is not already matched or selected
    if (event.target.getAttribute("data-matched") === "false" && event.target.getAttribute("data-sel") !== "true") {
      
      // if it's the first card clicked...
      if (cardsShown.length === 0) {
        event.target.setAttribute("data-sel", "true");
        event.target.style.backgroundColor = event.target.getAttribute("class");
        cardsShown.push(event.target);
      
        // if it's the second card clicked...
      } else if(cardsShown.length === 1) {
        // add to # of guesses and update text
        guesses++;
        curScore.innerText = `Current # of guesses: ${guesses}`;
        // add selected card to cardsShown array
        cardsShown.push(event.target);
        
        //check if the 2 cards in the array are a match. If true...
        if (checkForMatch(cardsShown)) {
          // set backgroundColor equal to their attribute
          event.target.style.backgroundColor = event.target.getAttribute("class");
          // and empty the array
          cardsShown = [];
          // update game progress
          points++;
          //if there are 5 matches, end the game
          if (points === 5) {
            gameOver();
          }
        // if the cards selected aren't a match...
        } else {
          event.target.style.backgroundColor = event.target.getAttribute("class");
          // set the first card to data-sel to "false" (unselected)
          cardsShown[0].setAttribute("data-sel", "false");   
          // "flip" the cards back over and empty the cardsShown array
          setTimeout(function() {
            cardsShown[0].style.backgroundColor = "whitesmoke";
            cardsShown[1].style.backgroundColor = "whitesmoke";
            cardsShown = [];
          }, 1000);
        }
      }
    }
  }
  
  function checkForMatch(arr) {
    if (arr[0].getAttribute("class") == arr[1].getAttribute("class") && arr[1].getAttribute("data-sel") != "true") {
      arr[0].setAttribute("data-matched", "true");
      arr[1].setAttribute("data-matched", "true");
      return true;
    } else {
      return false;
    }
  }

  function gameOver() {

    if (guesses < highScore || !highScore) {
      localStorage.setItem("highScore", JSON.stringify(guesses));
    }

    let winMsg = document.createElement('h2');
    let restart = document.createElement('button');
    let mG = document.querySelector('h1');

    winMsg.innerText = "Congrats! You win!";
    restart.innerText = "Play again?";
    restart.setAttribute("class", "button");
    
    mG.parentNode.insertBefore(winMsg, mG.nextSibling);
    mG.parentNode.insertBefore(restart, winMsg.nextSibling);

    restart.addEventListener("click", function() {
      winMsg.remove();
      restart.remove();
      startGame();
    });
  }

  // when the DOM loads
  createDivsForColors(shuffledColors);

}