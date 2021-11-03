'use strict';

const startGame = function () {
  // DOM
  const player1El = document.querySelector('.player-0');
  const player2El = document.querySelector('.player-1');
  const score0El = document.querySelector('#score-0');
  const score1El = document.querySelector('#score-1');
  const curScore0El = document.querySelector('#cur-score-0');
  const curScore1El = document.querySelector('#cur-score-1');
  const diceEl = document.querySelector('.dice-img');

  const btnRoll = document.querySelector('.btn-roll');
  const btnHold = document.querySelector('.btn-hold');
  const btnNew = document.querySelector('.btn-new');
  const allBtn = document.querySelectorAll('#btn-disabled');

  //   Vars
  let dice, totalScore, curScore, activePlayer;

  //   Functions
  const resetGame = function () {
    score0El.textContent = 0;
    score1El.textContent = 0;
    curScore0El.textContent = 0;
    curScore1El.textContent = 0;

    totalScore = [0, 0];
    curScore = 0;
    activePlayer = 0;

    player1El.classList.add('player--active');
    player2El.classList.remove('player--active');
    player1El.classList.remove('player--win');
    player2El.classList.remove('player--win');
    allBtn.forEach(btn => (btn.disabled = false));
    diceEl.classList.add('hidden');
    btnHold.disabled = true;
  };
  resetGame();

  const playerSwitch = function () {
    activePlayer = activePlayer ? 0 : 1;
    player1El.classList.toggle('player--active');
    player2El.classList.toggle('player--active');
  };

  const curScoreCalc = function (sum) {
    sum ? (curScore += dice) : (curScore = 0);
    document.querySelector(`#cur-score-${activePlayer}`).textContent = curScore;
  };

  // Roll
  btnRoll.addEventListener('click', () => {
    diceEl.classList.remove('hidden');
    btnHold.disabled = false;

    dice = Math.trunc(Math.random() * 6) + 1;
    diceEl.src = `images/dice-${dice}.png`;

    curScoreCalc(true);

    if (dice === 1) {
      curScoreCalc(false);
      playerSwitch();
    }
  });

  // Hold
  btnHold.addEventListener('click', () => {
    totalScore[activePlayer] += curScore;
    document.querySelector(`#score-${activePlayer}`).textContent =
      totalScore[activePlayer];

    if (totalScore[activePlayer] < 100) {
      curScoreCalc(false);
      playerSwitch();
    }

    if (totalScore[activePlayer] >= 100) {
      document
        .querySelector(`.player-${activePlayer}`)
        .classList.add('player--win');

      allBtn.forEach(btn => (btn.disabled = true));
    }
  });

  // New Game
  btnNew.addEventListener('click', resetGame);
};

startGame();
