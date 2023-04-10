const score = document.querySelector('.score_container'),
    startBtn = document.querySelector('.game__start'),
    game = document.querySelector('.game'),
    car = document.createElement('div'),
    diffBtn = document.querySelectorAll('.difficulty__button'),
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


let lines,//блоки заднего фона
    enemies; //препятствия
let gameArea;
const lineStyles = ['img_1', 'img_2', 'img_3', 'img_4'];
const enemyOffsets = [-20, -10, 10, 20];
const lineAvailablePositions = [];
let enemyStyles = ['enemy1', 'enemy2', 'enemy3', 'enemy4'];
const enemyPositions = [
    (65 / 390),
    0.5,
    (330 / 390),
];

const settings = {
    start: false,
    score: 0,
    speed: 6,
    traffic: 3,
    mode: 'gravity'
};


let speedSum = settings.speed
let speedSumInc = 1
let puddleSpeedSum = settings.speed
let puddleSpeedSumInc = 1

car.classList.add('car');

document.addEventListener('keydown', startGame);
document.addEventListener('keyup', stopGame);

const music = ['./audio/game-audio.wav', './audio/boom.wav', './audio/splash.wav'];
const audio = new Audio();
audio.src = music[0];
audio.volume = 0.1;
const boomAudio = new Audio();
boomAudio.src = music[1];
boomAudio.volume = 0.1;
const splashAudio = new Audio();
splashAudio.src = music[2];
splashAudio.volume = 0.1;


//Лужа
const puddle = document.createElement('div');
puddle.classList.add('puddle');
puddle.y = -2500;
puddle.style.top = '-2500px';

//ВСПЛЕСК
const splash = document.createElement('div');
splash.classList.add('splash');
splash.classList.add('hide');

const keys = {
    ArrowDown: false,
    ArrowUp: false,
    ArrowLeft: false,
    ArrowRight: false,
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
            speedSum = settings.speed;
            diffBtn.forEach(item => {
                item.classList.remove('active');
            });
            item.classList.add('active');
            enemyStyles = ['enemy1', 'enemy2'];
        } else if (item.classList.contains('medium')) {
            // settings.speed = 8;
            // settings.traffic = 3;
            settings.mode = 'gravity'
            diffBtn.forEach(item => {
                item.classList.remove('active');
            });
            item.classList.add('active');
            speedSum = settings.speed / 2;
            enemyStyles = ['enemy1', 'enemy2', 'enemy3', 'enemy4'];
        } else if (item.classList.contains('hard')) {
            // settings.speed = 10;
            // settings.traffic = 2.5;
            settings.mode = 'comfort'
            diffBtn.forEach(item => {
                item.classList.remove('active');
            });
            item.classList.add('active');
            speedSum = settings.speed / 2;
            enemyStyles = ['enemy1', 'enemy2'];
        }
    });
});

startBtn.addEventListener('click', () => {
    startMenu.classList.add('hide');
    game.innerHTML = '';
    car.style.left = 'calc(50% - 25px)';
    car.style.bottom = '75px';
    screenGame.classList.add('screen-up')
    screenGame.classList.remove('screen_hide')
    screenStart.classList.remove('screen_show');
    score.classList.remove('hide');

    gameArea = document.createElement('div');
    gameArea.classList.add('gamearea');
    game.appendChild(gameArea);

    // ГЕНЕРАЦИЯ ПОЛЯ
    for (let j = 0; j < 5; j++) {
        const line_block = document.createElement('div');
        line_block.classList.add('line_block');
        line_block.style.bottom = (j) * 298 + 'px';
        line_block.y = ((j) * 298);
        line_block.style.backgroundImage = 'url("image/' + settings.mode + '/' + lineStyles[random(lineStyles.length)] + '.png")'
        game.appendChild(line_block);
    }
    lines = document.querySelectorAll('.line_block');


    // ГЕНЕРАЦИЯ ПРЕПЯТСТВИЙ
    for (let i = 0; i < 16; i++) {//lines
        let y = -500 * (i + 1);

        let countCars = i % 3 == 0 ? 2 : 1; // количество машин на одной полосе
        let enemyOffsetsArray = JSON.parse(JSON.stringify(enemyOffsets));
        lineAvailablePositions[i] = [...enemyPositions];

        for (let j = 0; j < countCars; j++) {//lines
            let randPos = random(lineAvailablePositions[i].length)
            let carPos = lineAvailablePositions[i][randPos];
            let randOffset = random(enemyOffsetsArray.length)
            let enemyOffset = enemyOffsetsArray[randOffset]
            lineAvailablePositions[i].splice(randPos, 1)
            enemyOffsetsArray.splice(randOffset, 1)

            const enemy = document.createElement('div');
            enemy.classList.add('enemy');
            enemy.classList.add(settings.mode);
            enemy.dataset.line = i;
            enemy.dataset.pos = carPos;
            enemy.dataset.offset = enemyOffset;
            let chosen_enemy = enemyStyles[random(enemyStyles.length)]
            enemy.classList.add(chosen_enemy);
            enemy.dataset.current = chosen_enemy;
            // chosen_enemy.name = 'enemy1.png';
            // enemy.style.background =
            //     'rgba(0, 0, 0, 0) url(image/' + settings.mode + '/' + chosen_enemy.name + '.svg) center / cover no-repeat';
            // enemy.style.background =
            //     'rgba(0, 0, 0, 0) url(image/' + chosen_enemy + '.png) center / cover no-repeat';
            // enemy.style.width = chosen_enemy.width
            // enemy.style.height = chosen_enemy.height
            enemy.y = y + enemyOffset
            enemy.style.top = enemy.y + 'px';
            gameArea.appendChild(enemy);
            enemy.style.left = gameArea.offsetWidth * carPos - (enemy.clientWidth / 2) + 'px'
        }
    }
    enemies = document.querySelectorAll('.enemy');

    //Background лужи
    puddle.style.backgroundImage = 'url("image/' + settings.mode + '/puddle.svg")'
    gameArea.appendChild(puddle);
    gameArea.appendChild(splash);

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
        settings.x = Math.ceil(posX1) - ( 100 / 590 * gameArea.offsetWidth) - 50
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
        score.innerHTML = settings.score;
        moveRoad();
        moveEnemy();
        movePuddle();

        let checkScore = settings.score % 5000

        if (settings.speed <= 12 && checkScore > 4996 || (checkScore >= 0 && checkScore < 4)) {
            settings.speed += 1
            speedSum += speedSumInc
            puddleSpeedSum += puddleSpeedSumInc
        }

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
            diffBtn.forEach(item => {
                item.classList.remove('active');
            });
        }
        item.y += speedSum;
        item.style.top = item.y + 'px';
        if (item.y >= document.documentElement.clientHeight) {
            item.y = -8000 + document.documentElement.clientHeight;
            let carPos =  lineAvailablePositions[item.dataset.line][0];
            let chosen_enemy = enemyStyles[random(enemyStyles.length)]
            // item.classList.remove(item.dataset.current)
            // item.classList.add(chosen_enemy)

            // item.style.left = 'calc(' + carPos + ' - ' + chosen_enemy.width + '/ 2)'
            // console.log(gameArea.offsetWidth)
            // console.log(lineAvailablePositions[item.dataset.line][0])
            item.style.left = gameArea.offsetWidth * carPos - (item.offsetWidth / 2) + 'px'
            lineAvailablePositions[item.dataset.line] = [item.dataset.pos]
            item.dataset.pos = carPos;


            // item.style.background =
            //     'rgba(0, 0, 0, 0) url(./image/' + chosen_enemy.name + '.png) center / cover no-repeat';
            // item.style.width = chosen_enemy.width
            // item.style.height = chosen_enemy.height
        }
    });
}

function movePuddle() {
    let carRect = car.getBoundingClientRect();
    let carXPos = car.style.left;
    let enemyRect = puddle.getBoundingClientRect();
    if (carRect.top - enemyRect.bottom <= puddleSpeedSum && carRect.top - enemyRect.bottom >= -puddleSpeedSum) {
        splashAudio.play()
        splash.classList.remove('hide');
        splash.style.left = 'calc(' + carXPos +  ' - ' + ((gameArea.offsetWidth * 212 / 590 / 2) - 25) + 'px)'
        splash.style.top = carRect.top + 'px';
        setTimeout(() => {
            splash.classList.add('splash-after');
            splash.style.left = 'calc(' + carXPos +  ' - ' + ((gameArea.offsetWidth * 300 / 590 / 2) - 25) + 'px)'
            splash.style.top = carRect.top + 'px';
            setTimeout(() => {
                splash.classList.remove('splash-after');
                splash.classList.add('hide');
            }, 100);
        }, 100);
    }
    puddle.y += puddleSpeedSum;
    puddle.style.top = puddle.y + 'px';
    if (puddle.y >= document.documentElement.clientHeight) {
        puddle.y = -2500;
    }
}


document.addEventListener('touchstart', swipeStart);