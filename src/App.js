//AI -> gameSign[0], Human -> gameSign[1]
var gameSign = ["X", "O"];
var gameAreas = document.querySelectorAll(".area");
var currentPlayer;
var chosenLevel;
var playedMoves = 0;
// creating two dimensional array for game table
var gameTable = [
  ["", "", "", ""],
  ["", "", "", ""],
  ["", "", "", ""],
  ["", "", "", ""],
];
// creating two dimensional array for game fields
var gameFields = [];

for (var i = 0; i < 4; i++) {
  for (var j = 0; j < 4; j++) {
    gameFields[i] = [];
  }
}

// get area divs into two dimensional array
var counter = 0;
for (let i = 0; i < 4; i++) {
  for (let j = 0; j < 4; j++) {
    gameFields[i][j] = gameAreas[counter++];
  }
}

// gets value of all gameFields into gameTable
function updateGameTable() {
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      gameTable[i][j] = gameFields[i][j].innerHTML;
    }
  }
}

// adding event listener to buttons and depends on player input call function for selected difficulty
document.querySelectorAll(".diff").forEach((element) => {
  element.addEventListener("click", (event) => {
    chosenLevel = event.target.name;
    document.querySelector(".difficulty-bar").style.display = "none";
    document.querySelector(".turn-status").style.display = "block";
    //starts game
    startGame();
  });
});

function startGame() {
  //ads event listeners to all fields
  getEmptyFields().forEach((element) => {
    element.addEventListener("click", placeHumanPlayerSign);
  });
  //choses randomly who will play first move, gives X to first player and calls first player
  var players = ["AI", "Human"];
  currentPlayer = players[Math.floor(Math.random() * players.length)];

  if (currentPlayer == "AI") {
    moveAI();
  } else {
    // rotates signs if human is first
    gameSign = ["O", "X"];
    currentPlayer = "Human";
    document.querySelector(".turn-status").innerHTML = "Its your turn:";
  }
}
//calls next player depending on who was previous player
function nextPlayer() {
  updateGameTable();
  
  if (checkWinner() == null) {
    if (currentPlayer === "AI") {
      // adds hover class for all empty fields
      getEmptyFields().forEach((element) => {
        element.classList.add("field");
      });

      currentPlayer = "Human";
      document.querySelector(".turn-status").innerHTML = "Its your turn:";
    } else {
      moveAI();
    }
  } else if (checkWinner() == gameSign[0]) {
    document.querySelector(".turn-status").innerHTML = "Computer Won";
  } else if (checkWinner() == gameSign[1]) {
    document.querySelector(".turn-status").innerHTML = "You Won";
    currentPlayer = "";
  } else {
    document.querySelector(".turn-status").innerHTML = "Draw!";
  }
}

function placeHumanPlayerSign(e) {
  if (currentPlayer == "Human" && e.target.innerHTML == "") {
    e.target.innerHTML = gameSign[1];
    playedMoves++;
    nextPlayer();
    
  }
}

function moveAI() {
  currentPlayer = "AI";
  document.querySelector(".turn-status").innerHTML = "Its Computer turn.";
  //removes hover class while computer is playing
  gameAreas.forEach((element) => {
    element.classList.remove("field");
  });
window.setTimeout(()=>{
  switch(chosenLevel) {
    case "Easy":
      // AI is playing only random positions
      easyAI();
      break;

    case "Medium":
      // AI will play 60% hard ans 40% easy
     let rnd = Math.floor(Math.random() * 101);
     
     if(rnd <= 60){
       hardAI();
     }
     else{
       easyAI();
     }
      break;
    case "Hard":
      // AI will be unbeatable using minimax algorithm
      hardAI();
      break;
  }},2000);
}
function easyAI() {
  //choses random empty field
  let emptyFields = getEmptyFields();

  emptyFields[Math.floor(Math.random() * emptyFields.length)].innerHTML =
    gameSign[0];

  nextPlayer(currentPlayer);
}

function hardAI() {
  
  //gets number of human played moves
  
 
  //check if human player played 3 or more moves
  if (playedMoves >= 3) {
    if (checkNextHumanMove()) {
      nextPlayer();
    }else{
      getEmptyFields()[0].innerHTML = gameSign[0];
      nextPlayer();
    }
  } else {
    getEmptyFields()[0].innerHTML = gameSign[0];
    nextPlayer();
  }
}



function checkNextHumanMove() {
  
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      
      if (gameTable[i][j] == "") {
        console.log('f');
        gameTable[i][j] = gameSign[0];
       
        if (checkWinner() == gameSign[0]) {
          
          gameFields[i][j].innerHTML = gameSign[0];
          return true;
        }
        gameTable[i][j] = gameSign[1];
        if(checkWinner() == gameSign[1]){
          
          gameFields[i][j].innerHTML = gameSign[0]
          return true;
        }
          gameTable[i][j] = "";
        
      }
    }
  }
  return false;
}

function equals4(n1, n2, n3, n4) {
  return n1 == n2 && n2 == n3 && n3 == n4 && n1 != "";
}

function checkWinner() {
  var winner = null;
  //horizontal
  for (let i = 0; i < 4; i++) {
    if (
      equals4(
        gameTable[i][0],
        gameTable[i][1],
        gameTable[i][2],
        gameTable[i][3]
      )
    ) {
      return gameTable[i][0];
    }
  }
  //vertical
  for (let i = 0; i < 4; i++) {
    if (
      equals4(
        gameTable[0][i],
        gameTable[1][i],
        gameTable[2][i],
        gameTable[3][i]
      )
    ) {
      return gameTable[0][i];
    }
  }
  //diagonal
  if (
    equals4(gameTable[0][0], gameTable[1][1], gameTable[2][2], gameTable[3][3])
  ) {
    return gameTable[0][0];
  }
  if (
    equals4(gameTable[0][3], gameTable[1][2], gameTable[2][1], gameTable[3][0])
  ) {
    return gameTable[0][3];
  }
  //checks for squares

  //checks for draw
  if (winner == null && getEmptyFields().length == 0) {
    return "draw";
  } else {
    return winner;
  }
}
// goes through all fields end gets empty ones
function getEmptyFields() {
  var emptyFields = [];
  for (let i = 0; i < 16; i++) {
    if (gameAreas[i].innerHTML == "") {
      emptyFields.push(gameAreas[i]);
    }
  }

  return emptyFields;
}
