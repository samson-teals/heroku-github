//---------------GLOBAL VARIABLES---------------
var boardLength = 10;
var mineCount = Math.round(boardLength * 1.5);
var flagsLeft = mineCount;
var minesMarked = 0;
var gameOn = false;
var flagClicked = false;

var board = []; //2d array of Space objects
var minePlace = []; //2d array of mine coords

//timer vars
var t, hours, minutes, seconds;


class Space {
  constructor(x, y) {
    this.px = x;
    this.py = y;
    this.isFlagged = false;
    this.isRevealed = false;
  }
}


//---------------INIT---------------
function init() {
  $('#space-container').html('');
  board = [];
  minePlace = [];
  var mineCount = Math.round(boardLength * 1.5);
  var flagsLeft = mineCount;
  for (var y = 0; y < boardLength; y++) {
    $('#space-container').append('<div>');
    if (!board[y]) board[y] = new Array(boardLength);
    for (var x = 0; x < boardLength; x++) {
      if (!board[y][x]) board[y][x] = new Space(x, y);
      $('#space-container').append(`<img id=${x},${y} src=${unrevealed} class="space" onclick="sweep(${x},${y})" oncontextmenu="plantFlag(${x},${y});return false;">`);
    }
    $('#space-container').append('</div>');
  }
  $('#flags').html(`Flags: ${flagsLeft}`);
}

//---------------START GAME---------------
$('#newgame').click(function() {
  gameOn = !gameOn;
  $('#congrats').html('');
  if (!gameOn) {
    death();
  } else {
    timeStart();
    init();
    for (var i = 0; i < boardLength; i++) {
      for (var j = 0; j < boardLength; j++) {
        document.getElementById(i + ',' + j).src = unrevealed;
      }
    }

    //-----------minegen-----------
    for (var i = 0; i < mineCount; i++) {
      xval = Math.floor(Math.random() * boardLength);
      yval = Math.floor(Math.random() * boardLength);
      minePlace[i] = [xval, yval]; //he generate points
    }
    for (var j = 0; j < mineCount; j++) { //he check that no doubles 
      for (var k = j; k < mineCount; k++) {
        if (k != j && JSON.stringify(minePlace[k]) == JSON.stringify(minePlace[j])) {
          minePlace[j] = [Math.floor(Math.random() * boardLength),
            Math.floor(Math.random() * boardLength)
          ];
          k = 0;
          j = 0;
        }
      }
    }

  }
})

//---------------TIMER CODE---------------
function timeStart() {
  var temp = Date.now(); //saves start time

  t = setInterval(addOneSecond, 1000);

  function addOneSecond() {
    hours = Math.floor((Date.now() - temp) / 1000 / 3600);
    minutes = Math.floor((Date.now() - temp) / 1000 / 60 - hours * 60);
    seconds = Math.floor((Date.now() - temp) / 1000 - minutes * 60);

    //code below displays the time in a consistent format
    if (hours == 0 && seconds < 10) {
      $('#timer').html("Time: " + minutes + ":0" + seconds);
    } else if (hours == 0) {
      $('#timer').html("Time: " + minutes + ":" + seconds);
    } else {
      $('#timer').html("Time: " + hours + ":" + minutes + ":" + seconds);
    }
  }
}

//---------------ON FLAGCLICK CODE--------------
function flagClick() {
  if (gameOn) {
    flagClicked = !flagClicked;
    var poisespace;
    //make all grasses poiseflag or return to normal
    for (var y = 0; y < boardLength; y++) {
      for (var x = 0; x < boardLength; x++) {
        poisespace = board[y][x];
        if (poisespace.isRevealed == false && poisespace.isFlagged == false && flagClicked) {
          $('#flagger').html('Sweep');
          document.getElementById(x + ',' + y).src = flagpoise;
        } else if (poisespace.isRevealed == false && poisespace.isFlagged == false && !flagClicked) {
          $('#flagger').html('Flag');
          document.getElementById(x + ',' + y).src = unrevealed;
        }
      }
    }
  }
}


function plantFlag(x, y) {
  //add rightclick handler into appended divs
  spaceToFlag = board[y][x];

  //if unflagged and flags are available
  if (gameOn && spaceToFlag.isFlagged == false && flagsLeft > 0 && spaceToFlag.isRevealed == false) {
    spaceToFlag.isFlagged = true;
    document.getElementById(x + ',' + y).src = flagged;
    flagsLeft--;
    $('#flags').html(`Flags: ${flagsLeft}`);
    if (isMined(spaceToFlag)) {
      minesMarked++;
      if (minesMarked == mineCount) {
        win();
      }
    }

  }
  // if already flagged  
  else if (gameOn && spaceToFlag.isFlagged == true && spaceToFlag.isRevealed == false) {
    spaceToFlag.isFlagged = false;
    flagsLeft++;
    $('#flags').html(`Flags: ${flagsLeft}`);
    if (flagClicked) {
      document.getElementById(x + ',' + y).src = flagpoise;
    } else if (!flagClicked) {
      document.getElementById(x + ',' + y).src = unrevealed;
    }
    if (isMined(spaceToFlag)) {
      minesMarked--;
    }
  }
}
//---------------ON LEFTCLICK CODE---------------
function sweep(x, y) {
  sweptSpace = board[y][x];
  if (flagClicked) {
    plantFlag(x, y);
  } else if (gameOn && sweptSpace.isRevealed == false) {
    if (isMined(sweptSpace) == true) {
      death();
    } else if (sweptSpace.isFlagged == false) {
      parse(sweptSpace);
    }
  }
}


function isMined(space) {
  for (var i = 0; i < minePlace.length; i++) {
    if (space.px == minePlace[i][0] && space.py == minePlace[i][1]) {
      return true;
    }
  }
  return false;
}

function parse(space) {
  if (gameOn && isMined(space) == false && space.isFlagged == false && space.isRevealed == false) {
    reveal(space);
    space.isRevealed = true;
    if (reveal(space) > 0) return;
    if (space.px > 0 && space.py > 0) {
      parse(board[space.py - 1][space.px - 1])
    } //NW block
    if (space.py > 0) {
      parse(board[space.py - 1][space.px])
    } //N block
    if (space.px < boardLength - 1 && space.py > 0) {
      parse(board[space.py - 1][space.px + 1])
    } //NE block
    if (space.px > 0) {
      parse(board[space.py][space.px - 1])
    } //W 
    if (space.px < boardLength - 1) {
      parse(board[space.py][space.px + 1])
    } //E block
    if (space.px > 0 && space.py < boardLength - 1) {
      parse(board[space.py + 1][space.px - 1])
    } //SW block
    if (space.py < boardLength - 1) {
      parse(board[space.py + 1][space.px])
    } //S block
    if (space.px < boardLength - 1 && space.py < boardLength - 1) {
      parse(board[space.py + 1][space.px + 1])
    } //SE block
  }
}

function reveal(space) {
  var numDisplay = 0;
  for (var i = -1; i < 2; i++) {
    for (var j = -1; j < 2; j++) {
      for (var f = 0; f < minePlace.length; f++)
        if (space.px + i == JSON.stringify(minePlace[f][0]) && space.py + j == JSON.stringify(minePlace[f][1])) {
          numDisplay++;
        }
    }
  }

  if (numDisplay == 0) {
    document.getElementById(space.px + ',' + space.py).src = revealedblank
  } else if (numDisplay == 1) {
    document.getElementById(space.px + ',' + space.py).src = one
  } else if (numDisplay == 2) {
    document.getElementById(space.px + ',' + space.py).src = two
  } else if (numDisplay == 3) {
    document.getElementById(space.px + ',' + space.py).src = three
  } else if (numDisplay == 4) {
    document.getElementById(space.px + ',' + space.py).src = four
  } else if (numDisplay == 5) {
    document.getElementById(space.px + ',' + space.py).src = five
  } else if (numDisplay == 6) {
    document.getElementById(space.px + ',' + space.py).src = six
  } else if (numDisplay == 7) {
    document.getElementById(space.px + ',' + space.py).src = seven
  } else if (numDisplay == 8) {
    document.getElementById(space.px + ',' + space.py).src = eight
  }
  return numDisplay;
}
//------------------------WIN CODE -----------------------------------
function win() {
  //timer stop
  clearInterval(t);
  hours = 0;
  minutes = 0;
  seconds = 0;
  gameOn = false;

  $('#congrats').html('Hooray! Garden again?');
}

//------------------------DEATH CODE -----------------------------------
function death() {
  //timer stop
  clearInterval(t);
  hours = 0;
  minutes = 0;
  seconds = 0;
  gameOn = false;

  //display bombs
  for (var i = 0; i < minePlace.length; i++) {
    document.getElementById(JSON.stringify(minePlace[i][0]) + ',' + JSON.stringify(minePlace[i][1])).src = deathSpace;
  }
  $('#congrats').html('Replant?');
}
//------------------------BOARD STATES (PICTURES) -----------------------------------
var unrevealed = "https://cdn2.iconfinder.com/data/icons/gardening-caramel-vol-2/256/GRASS-256.png"
var revealedblank = "https://cdn2.iconfinder.com/data/icons/gardening-caramel-vol-1/256/DANDELION-256.png"
var flagged = "https://cdn2.iconfinder.com/data/icons/gardening-caramel-vol-3/256/TULIP-256.png"
var flagpoise = "https://cdn2.iconfinder.com/data/icons/gardening-caramel-vol-3/256/SEEDLING-256.png"
var one = "https://cdn0.iconfinder.com/data/icons/internet-activity-3-1/32/number_one_count-256.png"
var two = "https://cdn0.iconfinder.com/data/icons/internet-activity-3-1/32/number_two_count-256.png"
var three = "https://cdn0.iconfinder.com/data/icons/internet-activity-3-1/32/number_three_count-256.png"
var four = "https://cdn0.iconfinder.com/data/icons/internet-activity-3-1/32/number_four_count-256.png"
var five = "https://cdn0.iconfinder.com/data/icons/internet-activity-3-1/32/number_five_count-256.png"
var six = "https://cdn0.iconfinder.com/data/icons/internet-activity-3-1/32/number_six_count-256.png"
var seven = "https://cdn0.iconfinder.com/data/icons/internet-activity-3-1/32/number_seven_count-256.png"
var eight = "https://cdn0.iconfinder.com/data/icons/internet-activity-3-1/32/number_eight_count-256.png"
var deathSpace = "https://cdn2.iconfinder.com/data/icons/gardening-caramel-vol-2/256/MUSHROOM-256.png"

