let score = 0;
let timeLeft = 30;
const gameContainer = document.getElementById('game-container');
const crosshair = document.getElementById('crosshair');
const scoreDisplay = document.getElementById('score');
const timerDisplay = document.getElementById('timer');

document.addEventListener('mousemove', (e) => {
  crosshair.style.left = e.clientX + 'px';
  crosshair.style.top = e.clientY + 'px';
});

document.addEventListener('click', (e) => {
  showShotAnimation(e.clientX, e.clientY);
  shootDuck(e.clientX, e.clientY);
});

function shootDuck(x, y) {
  const ducks = Array.from(document.getElementsByClassName('duck'));
  for (const duck of ducks) {
    const rect = duck.getBoundingClientRect();
    if (x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom) {
      duck.remove();
      score++;
      scoreDisplay.textContent = `Score: ${score}`;
      break;
    }
  }
}

/**
 * Displays a brief shot animation at the click location.
 */
function showShotAnimation(x, y) {
  const shot = document.createElement('div');
  shot.className = 'shot';
  shot.style.left = x + 'px';
  shot.style.top = y + 'px';
  gameContainer.appendChild(shot);
  setTimeout(() => shot.remove(), 500);
}

function createDuck() {
  const duck = document.createElement('div');
  duck.className = 'duck';
  const y = Math.random() * (window.innerHeight - 64);
  const fromLeft = Math.random() < 0.5;
  if (fromLeft) {
    duck.style.left = '-64px';
  } else {
    duck.style.left = window.innerWidth + 'px';
  }
  duck.style.top = `${y}px`;
  gameContainer.appendChild(duck);

  const endX = fromLeft ? window.innerWidth + 64 : -64;
  const duration = 2000 + Math.random() * 2000;
  duck.animate(
    [
      { transform: 'translateX(0)' },
      { transform: `translateX(${endX}px)` }
    ],
    { duration: duration, easing: 'linear' }
  ).onfinish = () => {
    duck.remove();
  };
}

function startGame() {
  const duckInterval = setInterval(createDuck, 800);
  const timerInterval = setInterval(() => {
    timeLeft--;
    timerDisplay.textContent = `Time: ${timeLeft}`;
    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      clearInterval(duckInterval);
      gameOver();
    }
  }, 1000);
}

function gameOver() {
  const gameOverText = document.createElement('div');
  gameOverText.id = 'game-over';
  gameOverText.textContent = `Game Over! Final Score: ${score}`;
  gameContainer.appendChild(gameOverText);
}

// Before starting the game, show a running pixel-art man across the screen.
function showRunningMan() {
  return new Promise(resolve => {
    const man = document.createElement('img');
    man.id = 'running-man';
    man.src = 'assets/sprites/man.png';
    gameContainer.appendChild(man);
    const duration = 3000;
    man.animate([
      { transform: 'translateX(-50px)' },
      { transform: `translateX(${window.innerWidth + 50}px)` }
    ], { duration: duration, easing: 'linear' }).onfinish = () => {
      man.remove();
      resolve();
    };
  });
}

window.onload = () => {
  showRunningMan().then(startGame);
};