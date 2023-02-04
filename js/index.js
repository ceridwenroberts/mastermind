$(function () {
  let pegsNumberArr = new Array(1, 2, 3, 4, 5, 6);
  let guessArr = new Array(0, 0, 0, 0);
  const RIGHT_PLACE = "\u25CF";
  const WRONG_PLACE = "\u25B3";
  const EMPTY = "x";

  const rulesModal = $("#rulesModal")[0];
  const endModal = $("#endModal")[0];
  const lostModal = $("#lostModal")[0];
  let codeBoardComplete = $("#codeBoard, #codeBoard div, #codeBoard").toggle();

  init();
  function init() {
    $(".scoreSub, #codeBoard, #gameBoard").hide();
    introModal.showModal();
    btnNewGame();
  }

  function newGame() {
    $("#scorePeek").text("Score_9");
    $(".scoreSub, #codeBoard, #gameBoard").show();
    $(codeBoardComplete).hide();
    moveIndex = 9;
    btnNewGame();
    getCode(pegsNumberArr);
    displayGuessBoardRow(guessArr);
    setCurrentRow();
    displayCode(code);
    displayColorBoard(pegsNumberArr);
    btnsColorBoard();
    btnRules();
    btnCheck();
    btnClear();
    btnQuit();
  }

  function btnRules() {
    $("#openRules").click(function () {
      rulesModal.showModal();
    });

    $("#openIntroRules").click(function () {
      rulesModal.showModal();
    });

    $("#closeRules").click(function () {
      rulesModal.close();
    });
  }

  function btnCheck() {
    $("#check").click(function () {
      if (guessArr.length < 4) {
        noGuess.showModal();
        $("#noGuessModal").click(function () {
          noGuess.hide();
        });
      } else {
        $("#check").removeClass("clickable").attr("disabled", "disabled");
        $("#clear").removeClass("clickable").attr("disabled", "disabled");
        evaluateGuess();
      }
    });
  }

  function btnsColorBoard() {
    let hasGuessCount = 0;

    $(".colorPeg").click(function () {
      pegColor = $(this).css("background-color");
      // console.log(pegColor);

      guessColor = $(this).data("pegColorNr");
      console.log("pegColorNr från .data: " + guessColor);

      $("#target")
        .css("background-color", pegColor)
        .addClass("hasGuess")
        .removeClass("empty");
      guessIndex = $("#target").data("guessIndex");
      // console.log("guessIndex från .data: " + guessIndex);

      guessArr[guessIndex] = guessColor;
      // console.log("guessArr Final: ");
      console.log(guessArr);

      guessArr = guessArr.map(String);

      $("#target").removeAttr("id").next(".empty").attr("id", "target");
      $("#clear").addClass("clickable").removeAttr("disabled");

      $(".currentRow .guessSlot").each(function () {
        if ($(this).hasClass("hasGuess") === true) {
          hasGuessCount++;
          console.log("hasGuessCount " + hasGuessCount);
          if (hasGuessCount === 4) {
            $("#check").addClass("clickable").removeAttr("disabled");
          }
        } else {
          $("#check").disabled;
        }
      });
      hasGuessCount = 0;
    });
  }

  function btnClear() {
    $("#clear").click(function () {
      $(".currentRow .guessSlot")
        .css("background-color", "")
        .removeClass("hasGuess")
        .addClass("empty");

      $(".currentRow .guessSlot")
        .eq(0)
        .attr("id", "target")
        .siblings(".guessSlot")
        .removeAttr("id", "target");

      $(this).removeClass("clickable").attr("disabled", "disabled");
    });
  }

  function btnNewGame() {
    $(".btnNewGame").click(function () {
      rulesModal.close();
      lostModal.close();
      endModal.close();
      introModal.close();
      $(".codePeg, .gameBoardRow, .colorPeg").remove();
      newGame();
      console.log("btnNewGame clicked");
    });
  }

  function btnQuit() {
    $(".btnEndGame").click(function () {
      lostModal.close();
      endModal.close();
      introModal.close();
      introModal.showModal();
      init();
    });
  }

  function getCode(array) {
    if (Array.isArray(array)) {
      code = [];
      let arr = [...array];
      for (let i = 0; i < 4; i++) {
        let arrIndex = Math.floor(Math.random() * arr.length);
        code.push(arr[arrIndex]);
        code = code.map((num) => {
          return String(num);
        });
        let resultToReturn = false;
        resultToReturn = code.some((element, index) => {
          return code.indexOf(element) !== index;
        });
        if (resultToReturn) {
          arr.splice(arrIndex, 1);
        }
      }
      console.log(code);
      return code;
    }
  }

  function displayCode(array) {
    if (Array.isArray(array)) {
      for (i = 0; i < 4; i++) {
        $('<div class="codePeg hideBg"></div>')
          .data("number", array[i])
          .attr("id", "codeKey" + i)
          .addClass("color" + array[i])
          .appendTo("#codeBoard");
      }
    }
    let highScore = JSON.parse(localStorage.getItem("highScore")) || 0;
    $(".high span").text("Highscore_" + highScore);
  }

  function displayGuessBoardRow(array) {
    for (let rowInd = 0; rowInd < 10; rowInd++) {
      $("#gameBoard")
        .data("rowInd", rowInd)
        .prepend(
          "<div class='gameBoardRow' id='gameBoardRow" + rowInd + "'></div>"
        );
      if (Array.isArray(array)) {
        for (i = 0; i < 4; i++) {
          $("<div class='guessSlot'></div>")
            .data("guessIndex", i) //is used
            .appendTo("#gameBoardRow" + rowInd);
        }
      }
      $("<div id='hintsBoard" + rowInd + "'></div>")
        .appendTo("#gameBoardRow" + rowInd)
        .addClass("hintsBoard");
      if (Array.isArray(array)) {
        for (h = 0; h < 4; h++) {
          $("<div class='hintSlots'></div>")
            .data("hintIndex", h)
            .attr("id", "hintSlot" + h)
            .appendTo("#hintsBoard" + rowInd);
        }
      }
    }
  }

  function displayColorBoard(array) {
    if (Array.isArray(array)) {
      for (i = 0; i < 6; i++) {
        $("<div class='colorPeg'></div>")
          .data({ number: array[i], pegColorNr: array[i] }) //pegColorNr is used
          .attr("id", "colorKey" + array[i])
          .addClass("color" + array[i]) // is used
          .appendTo("#colorBoard"); //is used
      }
    }

    let parent = document.querySelector(".sticky").parentElement;
    while (parent) {
      const hasOverflow = getComputedStyle(parent).overflow;
      if (hasOverflow !== "visible") {
      }
      parent = parent.parentElement;
    }

    $(window).resize(function () {
      if ($(window).height() <= $("#container").height) {
        $("#colorBoard").addClass("sticky");
      }
    });
  }

  function evaluateGuess() {
    calculateHints(code, guessArr);
    shuffleArray(hints);
    colorHints(hints);
    moveIndex--;
    console.log("moveIndex after --: " + moveIndex);
    setCurrentRow();
  }

  function calculateHints(code, array) {
    console.log("moveIndex: " + moveIndex);
    let currentScore = moveIndex - 1;
    console.log("currentScore: " + currentScore);
    if (Array.isArray(array)) {
      hints = [];
      let winHints = [];
      let duplicateCheck = [];
      array.forEach((array, index) => {
        if (code[index] === array) {
          hints.push(RIGHT_PLACE);
          winHints.push(RIGHT_PLACE);
          // console.log(winHints.length);
          if (winHints.length === 4) {
            setScoreBoard(currentScore);
            $(".codePeg").toggleClass("hideBg");
            $(".colorPeg").attr("disable", "disable");
            codeBoardComplete.toggle();
            endModal.showModal();
            $(".codePeg").removeClass("hideBg"); //show right answer
            $("#codeBoard").removeAttr("display", "none");
          }
          // if (!duplicateCheck.includes(array)) {
          //   hints.push(RIGHT_PLACE);
          // }
          duplicateCheck.push(array);
        }
      });

      array.forEach((array, index) => {
        if (!duplicateCheck.includes(array) && code.includes(array)) {
          hints.push(WRONG_PLACE);
          duplicateCheck.push(array);
        }
      });

      while (hints.length < 4) {
        hints.push(EMPTY);
        console.log("hints: " + hints);
      }
    }

    if (moveIndex === 0) {
      console.log("lost");
      $(".codeBoard .codePeg").toggleClass("hideBg");
      $(".colorPeg").attr("disable", "disable");
      currentScore = 0;
      lostModal.showModal();
    }

    $(".rulesModal").append(
      "<div><p><span id='scorePeek'>Score: </span>" + currentScore + "</p>"
    );

    $(".current span").text("Score_" + currentScore);
    return hints;
  }

  function shuffleArray(array) {
    // The Fisher-Yates algoritm
    if (Array.isArray(array)) {
      for (let i = array.length - 1; i > 0; i--) {
        let randIndex = Math.floor(Math.random() * (i + 1));
        [array[randIndex], array[i]] = [array[i], array[randIndex]];
      }
    }
  }

  function colorHints(array) {
    if (Array.isArray(array)) {
      $(".currentRow .hintsBoard .hintSlots").each(function (index) {
        $(this)
          .removeAttr("id")
          .attr("id", "hintKey" + array[index]);
      });
    }
  }

  function setCurrentRow() {
    $("#check").removeClass("clickable").attr("disabled", "disabled");
    $("#clear").removeClass("clickable").attr("disabled", "disabled");
    $(".gameBoardRow")
      .eq(moveIndex)
      .addClass("currentRow")
      .siblings()
      .removeClass("currentRow");

    $(".currentRow .guessSlot").addClass("empty").eq(0).attr("id", "target");
  }

  function setScoreBoard(currentScore) {
    let highScore = JSON.parse(localStorage.getItem("highScore")) || 0;
    if (currentScore > highScore) {
      highScore = currentScore;
      localStorage.setItem("highScore", JSON.stringify(highScore));
    }

    console.log(`highScore: ${highScore}`);
  }
}); //main ready
