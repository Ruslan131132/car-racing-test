const score = document.querySelector('.score'),
    startBtn = document.querySelector('.game__start'),
    gameArea = document.querySelector('.gamearea'),
    car = document.createElement('div'),
    diffBtn = document.querySelectorAll('.difficulty__button'),
    diffSelected = document.querySelector('.difficulty-selected'),
    screens = document.querySelectorAll('.screen'),
    screenGame = document.querySelector('.screen_game'),
    screenStart = document.querySelector('.screen_start'),
    startMenu = document.querySelector('.start__menu');

let allowSwipe = true;

let posInit = 0,
    posX1 = 0,
    posX2 = 0,
    posY1 = 0,
    posY2 = 0,
    posFinal = 0,
    isSwipe = false,
    isScroll = false;


let lines;//блоки заднего фона
const lineStyles = ['img_1', 'img_2', 'img_3', 'img_4'];


const enemyStyles = ['enemy1', 'enemy2', 'enemy3', 'enemy4', 'enemy5'];

car.classList.add('car');

document.addEventListener('keydown', startGame);
document.addEventListener('keyup', stopGame);

const music = ['./audio/game-audio.mp3'];
const audio = new Audio();
audio.src = music[0];
audio.volume = 0.1;

const keys = {
    ArrowDown: false,
    ArrowUp: false,
    ArrowLeft: false,
    ArrowRight: false,
};

const settings = {
    start: false,
    score: 0,
    speed: 6,
    traffic: 3,
    mode: 'gravity'
};

function getQuantityElements(heightElement) {
    return document.documentElement.clientHeight / heightElement + 1;
}

function random(num) {
    return Math.floor(Math.random() * num);
}

diffBtn.forEach(item => {
    item.addEventListener('click', () => {
        if (item.classList.contains('easy')) {
            // settings.speed = 5;
            // settings.traffic = 3.5;
            settings.mode = 'offroad'
            diffSelected.textContent = 'Выбрана сложность: легкая';
            diffBtn.forEach(item => {
                item.classList.remove('active');
            });
            item.classList.add('active');
        } else if (item.classList.contains('medium')) {
            // settings.speed = 8;
            // settings.traffic = 3;
            settings.mode = 'gravity'
            diffSelected.textContent = 'Выбрана сложность: средняя';
            diffBtn.forEach(item => {
                item.classList.remove('active');
            });
            item.classList.add('active');
        } else if (item.classList.contains('hard')) {
            // settings.speed = 10;
            // settings.traffic = 2.5;
            settings.mode = 'gravity'
            diffSelected.textContent = 'Выбрана сложность: сложная';
            diffBtn.forEach(item => {
                item.classList.remove('active');
            });
            item.classList.add('active');
        }
    });
});

startBtn.addEventListener('click', () => {
    startMenu.classList.add('hide');
    gameArea.innerHTML = '';
    car.style.left = 'calc(50% - 25px)';
    car.style.bottom = '75px';
    screenGame.classList.add('screen-up')
    screenGame.classList.remove('screen_hide')
    screenStart.classList.remove('screen_show');
    // ГЕНЕРАЦИЯ ПОЛЯ
    for (let j = 0; j < 5; j++) {
        const line_block = document.createElement('div');
        line_block.classList.add('line_block');
        line_block.style.bottom = (j) * 298 + 'px';
        line_block.y = ((j) * 298);
        line_block.style.backgroundImage = 'url("image/' + settings.mode + '/' + lineStyles[random(lineStyles.length)] + '.png")'
        gameArea.appendChild(line_block);
    }

    lines = document.querySelectorAll('.line_block');

    for (let i = 0; i < getQuantityElements(80 * settings.traffic); i++) {
        const enemy = document.createElement('div');
        enemy.classList.add('enemy');
        enemy.y = -100 * settings.traffic * (i + 1);
        enemy.style.left = Math.floor(Math.random() * (gameArea.offsetWidth - 50)) + 'px';
        enemy.style.top = enemy.y + 'px';
        enemy.style.background =
            'rgba(0, 0, 0, 0) url(./image/' +
            enemyStyles[random(enemyStyles.length)] +
            '.png) center / cover no-repeat';
        gameArea.append(enemy);
        gameArea.appendChild(enemy);
    }
    settings.score = 0;
    settings.start = true;
    gameArea.appendChild(car);
    settings.x = car.offsetLeft;
    settings.y = car.offsetTop;
    audio.autoplay = true;
    audio.play();
    requestAnimationFrame(playGame);
});


// sliderTrack.addEventListener('transitionend', () => allowSwipe = true);


let getEvent = function () {
    return (event.type.search('touch') !== -1) ? event.touches[0] : event;
}

let swipeStart = function () {
    let evt = getEvent();


    if (allowSwipe) {

        posInit = posX1 = evt.clientX;
        posY1 = evt.clientY;
        //если страница с игрой и игра идет?

        document.addEventListener('touchmove', swipeAction);
        document.addEventListener('touchend', swipeEnd);
    }
}

let swipeEnd = function() {
    posFinal = posInit - posX1;

    isScroll = false;
    isSwipe = false;

    document.removeEventListener('touchmove', swipeAction);
    document.removeEventListener('touchend', swipeEnd);

    keys.ArrowRight = false
    keys.ArrowLeft = false
}


let swipeAction = function() {

    let evt = getEvent();

    posX2 = posX1 - evt.clientX;
    posX1 = evt.clientX;


    posY2 = posY1 - evt.clientY;
    posY1 = evt.clientY;

        keys.ArrowRight = false
        keys.ArrowLeft = false
        settings.x = Math.ceil(posX1) - 25
        if (settings.x > gameArea.offsetWidth - car.offsetWidth) {
            settings.x = gameArea.offsetWidth - car.offsetWidth
        }
        if (settings.x < 0) {
            settings.x = 0
        }
        return
}

function startGame(event) {
    event.preventDefault();
    keys[event.key] = true;
}

function playGame() {
    if (settings.start) {
        settings.score += settings.speed;
        score.innerHTML = 'Score <br>' + settings.score;
        moveRoad();
        moveEnemy();
        if (keys.ArrowLeft && settings.x > 0) {
            settings.x -= settings.speed;
        }
        if (keys.ArrowRight && settings.x < gameArea.offsetWidth - car.offsetWidth) {
            settings.x += settings.speed;
        }
        if (keys.ArrowUp && settings.y > 0) {
            settings.y -= settings.speed;
        }
        if (keys.ArrowDown && settings.y < gameArea.offsetHeight - car.offsetHeight) {
            settings.y += settings.speed;
        }
        car.style.top = settings.y + 'px';
        car.style.left = settings.x + 'px';
        requestAnimationFrame(playGame);
    }
}

function stopGame(event) {
    event.preventDefault();
    keys[event.key] = false;
}

function moveRoad() {
    lines.forEach(function (line) {
        line.y -= settings.speed;
        line.style.bottom = line.y + 'px';
        if (line.y <= -298) {
            line.y = 1192 + line.y + 298;
            line.style.backgroundImage = 'url("image/' + settings.mode + '/' + lineStyles[random(lineStyles.length)] + '.png")'

        }
    });
}
function moveEnemy() {
    let enemies = document.querySelectorAll('.enemy');
    enemies.forEach(function (item) {
        let carRect = car.getBoundingClientRect();
        let enemyRect = item.getBoundingClientRect();
        if (
            carRect.top <= enemyRect.bottom &&
            carRect.right >= enemyRect.left &&
            carRect.left <= enemyRect.right &&
            carRect.bottom >= enemyRect.top
        ) {
            settings.start = false;

            audio.pause();
            audio.currentTime = 0;
            audio.autoplay = false;
            startMenu.classList.remove('hide');
            settings.speed = 5;
            settings.traffic = 3;
            diffSelected.textContent = '';
            diffBtn.forEach(item => {
                item.classList.remove('active');
            });
        }
        item.y += settings.speed / 2;
        item.style.top = item.y + 'px';
        if (item.y >= document.documentElement.clientHeight) {
            item.y = -80 * settings.traffic;
            item.style.left = Math.floor(Math.random() * (gameArea.offsetWidth - 50)) + 'px';
            item.style.background =
                'rgba(0, 0, 0, 0) url(./image/' +
                enemyStyles[random(enemyStyles.length)] +
                '.png) center / cover no-repeat';
        }
    });
}


document.addEventListener('touchstart', swipeStart);