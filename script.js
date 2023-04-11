const score = document.querySelector('.score_container'),
    game = document.querySelector('.game'),
    car = document.createElement('div'),
    diffBtn = document.querySelectorAll('.difficulty__button'),
    againBtn = document.querySelector('.play_again'),
    backToMenuBtn = document.querySelector('.change-mode-button'),
    leaderBtn = document.querySelector('.leader-button'),
    screenGame = document.querySelector('.screen_game'),
    screenStart = document.querySelector('.screen_start'),
    screenResult = document.querySelector('.screen_result'),
    pointsValue = document.querySelector('.points-value'),
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
    enemies, //препятствия
    gameArea,//игровое поле
    trustScroll;
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

function random(num) {
    return Math.floor(Math.random() * num);
}

diffBtn.forEach(item => {
    item.addEventListener('click', () => {
        if (item.classList.contains('offroad')) {
            settings.mode = 'offroad'
            speedSum = settings.speed;
            speedSumInc = 1
            enemyStyles = ['enemy1', 'enemy2'];
            generateGame()
        } else if (item.classList.contains('gravity')) {
            settings.mode = 'gravity'
            speedSum = settings.speed / 2;
            speedSumInc = 0.5
            enemyStyles = ['enemy1', 'enemy2', 'enemy3', 'enemy4'];
            generateGame()
        } else if (item.classList.contains('comfort')) {
            settings.mode = 'comfort'
            item.classList.add('active');
            speedSum = settings.speed;
            speedSumInc = 1
            enemyStyles = ['enemy1', 'enemy2'];
            generateGame()
        }
    });
});

function generateGame() {
    game.innerHTML = '';
    screenGame.classList.add('screen-show')
    screenGame.classList.remove('screen_hide')
    screenStart.classList.remove('screen-show')
    screenStart.classList.add('screen_hide')
    // screenResult.classList.add('screen_hide')
    // screenResult.classList.remove('screen-show')
    score.classList.remove('hide');
    gameArea = document.createElement('div');
    gameArea.classList.add('gamearea');
    game.appendChild(gameArea);
    car.style.left = 'calc(50% - 25px)';
    car.style.bottom = '170px';
    car.classList.add(settings.mode)

    trustScroll = document.createElement('div');
    trustScroll.classList.add('trust-scroll__image')
    trustScroll.style.display = 'block'
    setTimeout(() => {
        trustScroll.style.display = 'none'
    }, 3000);
    game.appendChild(trustScroll)

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
            enemy.y = y + enemyOffset
            enemy.style.top = enemy.y + 'px';
            gameArea.appendChild(enemy);
            enemy.style.left = gameArea.offsetWidth * carPos - (enemy.clientWidth / 2) + 'px'
        }
    }
    enemies = document.querySelectorAll('.enemy');

    //Background лужи
    if (settings.mode == 'offroad') {
        puddle.style.backgroundImage = 'url("image/' + settings.mode + '/puddle.svg")'
        gameArea.appendChild(puddle);
        gameArea.appendChild(splash);
    }

    //Машина на другой полосе

    // if (settings.mode == 'gravity') {
    //     let chosen_enemy = enemyStyles[random(enemyStyles.length)]
    //     enemyBack.style.background =
    //         'rgba(0, 0, 0, 0) url(image/' + settings.mode + '/' + chosen_enemy.name + '.svg) center / cover no-repeat';
    //     enemyBack.style.width = chosen_enemy.width
    //     enemyBack.style.height = chosen_enemy.height
    //     enemyBack.style.display = 'block'
    //     gameArea.appendChild(enemyBack);
    // }

    settings.score = 0;
    settings.start = true;
    gameArea.appendChild(car);
    settings.x = car.offsetLeft;
    settings.y = car.offsetTop;
    audio.autoplay = true;
    audio.loop = true;
    audio.play();
    requestAnimationFrame(playGame);
}
//
// againBtn.onclick = () => {
//     generateGame()
// }

// backToMenuBtn.onclick = () => {
//     screenResult.classList.add('screen_hide');
//     screenGame.classList.add('screen_hide')
//     screenStart.classList.remove('screen_hide');
//     screenStart.classList.add('screen_show');
//     car.classList.remove(settings.mode)
// }

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
        if (settings.mode == 'offroad') {
            movePuddle();
        }

        let checkScore = settings.score % 5000

        if (settings.speed <= 15 && checkScore > 4996 || (checkScore >= 0 && checkScore < 4)) {
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
            boomAudio.play()
            audio.pause();
            audio.currentTime = 0;
            audio.autoplay = false;
            const boom = document.createElement('div');
            boom.classList.add('boom');
            gameArea.append(boom);

            //ПОЗИЦИЯ ПО X
            if (carRect.right - enemyRect.left < 15) {
                boom.style.left = 'calc(' + item.style.left + ' - 25px)'
            } else if (enemyRect.right - carRect.left < 15) {
                boom.style.left = 'calc(' + car.style.left + ' - 25px)'
            } else {
                boom.style.left = 'calc(' + car.style.left + ' + 5px)'
            }

            //ПОЗИЦИЯ ПО Y
            if (enemyRect.bottom - carRect.top < 10) {
                boom.style.top = carRect.top - 25 + 'px';
            } else if (carRect.bottom - enemyRect.top < 10) {
                boom.style.top = enemyRect.top - 25 + 'px';
            } else {
                boom.style.top = enemyRect.top + 25 + 'px';
            }

            settings.speed = 6
            // pointsValue.innerHTML = settings.score;
            speedSum = settings.mode == 'gravity' ? settings.speed / 2 : settings.speed
            puddleSpeedSum = settings.speed;

            savePoints({
                mode: settings.mode,
                score: settings.score
            });

            setTimeout(() => {
                game.innerHTML = '';
                boomAudio.pause();
                boomAudio.currentTime = 0;
                // screenResult.classList.remove('screen_hide');
                screenStart.classList.add('screen_hide');
                screenGame.classList.add('screen_hide');
                againBtn.classList.add(settings.mode);
                screenGame.classList.remove('screen-up')
                score.classList.add('hide');
            }, 2000);
        }
        item.y += speedSum;
        item.style.top = item.y + 'px';
        if (item.y >= document.documentElement.clientHeight) {
            item.y = -8000 + document.documentElement.clientHeight;
            let carPos =  lineAvailablePositions[item.dataset.line][0];
            item.style.left = gameArea.offsetWidth * carPos - (item.offsetWidth / 2) + 'px'
            lineAvailablePositions[item.dataset.line] = [item.dataset.pos]
            item.dataset.pos = carPos;
        }
    });
}

function movePuddle() {
    let carRect = car.getBoundingClientRect();
    let carXPos = car.style.left;
    let enemyRect = puddle.getBoundingClientRect();
    if (carRect.top - enemyRect.bottom <= puddleSpeedSum && carRect.top - enemyRect.bottom >= -puddleSpeedSum) {
        splashAudio.play()
        splash.style.left = 'calc(' + carXPos +  ' - ' + ((gameArea.offsetWidth * 212 / 590 / 2) - 25) + 'px)'
        splash.style.top = carRect.top + 'px';
        splash.classList.remove('hide');
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

// leaderBtn.onclick = () => {
//     document.querySelector('.modal-overlay').classList.add('--show')
//     let modalBody = document.querySelector('.modal-body');
//     modalBody.innerHTML = ''
//     let xhr = new XMLHttpRequest();
//     xhr.open('GET', 'http://cordiant.4k-pr.com/api/getTopUsers', true);
//
//     xhr.setRequestHeader("Accept", "application/json");
//     xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
//     xhr.send();
//
//     xhr.onload = function () {
//         if (xhr.status != 200) { // анализируем HTTP-статус ответа, если статус не 200, то произошла ошибка
//             console.log(`Ошибка ${xhr.status}: ${xhr.statusText}`); // Например, 404: Not Found
//         } else { // если всё прошло гладко, выводим результат
//             console.log(`Готово, получили ${xhr.response.length} байт`); // response -- это ответ сервера
//             let response = JSON.parse(xhr.response);
//             modalBody.innerHTML = response.data.map(item => {
//                 return `<div class="user-item">
//                 <div class="user-info">
//                     <img class="user-img" src="${item.avatar ? 'http://cordiant.4k-pr.com/storage/' + item.avatar : 'image/icons/user.jpg'}">
//                     <span class="user-mode">${item.mode}</span>
//                 </div>
//                 <span class="user-name">${item.tg ? item.tg : item.name}</span>
//                 <span class="user-points">${item.count}</span>
//             </div>`
//             }).join('');
//         }
//     };
//
// }

function savePoints(data) {
    const urlParams = new URLSearchParams(window.location.search);
    let user_id = urlParams.get('user_id')

    if (user_id == null) return;

    let formData = JSON.stringify({
        user_id: user_id,
        count: data.score,
        mode: data.mode
    });

    let xhr = new XMLHttpRequest();
    xhr.open('POST', 'http://cordiant.4k-pr.com/api/addPoints', true);
    xhr.setRequestHeader("Accept", "application/json");
    xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
    xhr.send(formData);
}


document.addEventListener('touchstart', swipeStart);