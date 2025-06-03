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

function createDuck() {
  const duck = document.createElement('div');
  duck.className = 'duck';
  const y = Math.random() * (window.innerHeight - 32);
  const fromLeft = Math.random() < 0.5;
  if (fromLeft) {
    duck.style.left = '-32px';
  } else {
    duck.style.left = window.innerWidth + 'px';
  }
  duck.style.top = `${y}px`;
  gameContainer.appendChild(duck);

  const endX = fromLeft ? window.innerWidth + 32 : -32;
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

window.onload = () => {
  startGame();
};