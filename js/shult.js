let MIN_NUM;
let ADGE_LEN; // Длина стороны квадрата
let MAX_NUM; // Вычисляется на основании размера квадрата
let nextIndex = 0;
let sortedArr = [];
let shultArr = [];
let timer = 0;
let startTS = 0;
let isStarted = false;
let rating = [];
let isPlaying = true;
let isCheating = false

function setDimension (adgeLen = 5, minNum = 1) {
    MIN_NUM = minNum;

    adgeLen = Math.floor(adgeLen);
    adgeLen = Math.min(10, adgeLen);
    adgeLen = Math.max(2, adgeLen);
    ADGE_LEN = adgeLen;

    MAX_NUM = (ADGE_LEN ** 2) + MIN_NUM - 1; //  5 ** 2 = 25; 25 + 1 - 1 == 25
    drawShult()
    shultSize()
}

function clickPress (event) {
    if (event.keyCode === 13) {
        setCellCount()
        reset(getEl('changeBlockCount'))
    }
}

function reset (el) {
    el.value = '';
}


function setCellCount () {
    let cellCount = getEl('changeBlockCount').value
    if (cellCount !== String(Number(cellCount))) {
        notify('введите цифру');
        cellCount = 5;
        return false;
    }
    setDimension(cellCount, 1);
}

function getEl (id) {
    return document.getElementById(id);
}

function getStyle (id) {
    const el = getEl(id);
    return el && el.style;
}

/**
 * Возвращает массив - последовательность целых чисел от min до max
 * @param {Number} min
 * @param {Number} max
 * @return {Number[]}
 */
function getSequenceArray (min, max) {
    return [...Array(max - min + 1).keys()].map((i) => i + min);
}

/**
 * Перемешивает массив случайным образом
 * @param {Array} array
 */
function shuffleArray (array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}


/**
 * Сортирует глобально объявленный массив rating по возрастанию времени
 */
function sortRating () {
    rating.sort((playerA, playerB) => {
        return playerA[1] - playerB[1];
    })
}

/**
 * Обновление рейтинга игрока в памяти
 */
function updateRating () {
    const name = getEl('container__name').value.trim();
    const time = getTime();

    // Обновление рейтинга для плеера (в памяти)
    const player = rating.find((element) => {
        return element[0].toLowerCase() === name.toLowerCase();
    });

    if (player) {
        player[1] = Math.min(player[1], time);
    } else {
        rating.push([name, time]);
    }
}

/**
 * Сохранение рейтинга в браузере
 */
function saveRating () {
    localStorage.setItem('rating', JSON.stringify(rating));
}

function getRating () {
    const value = localStorage.getItem('rating');
    if (!value) {
        rating = [];
    } else {
        rating = JSON.parse(value);
    }
    return rating;
}

function saveName () {
    const lastName = getEl('container__name').value.trim()
    if (lastName) {
        localStorage.setItem('lastName', JSON.stringify(lastName));
    }
}

function getName () {
    const value = localStorage.getItem('lastName');
    if (!value) {
        getEl('container__name').value = '';
    } else {
        getEl('container__name').value = JSON.parse(value);
    }
    return getEl('container__name').value;
}

function clearRating () {

    if (confirm('Вы уверны?')) {
        rating = [];
        saveRating();
        drawRating();
    }
}


/**
 * Отрисовка таблицы рейтинга
 */
function drawRating () {
    sortRating();
    let img;
    if (theme) {
        img = 'trash'
    } else {
        img = 'trashNight'
    }
    let html = `<div class="rating-header">
<div class="rating-title">Рейтинг</div>
<div class="clear-rating"><img id="trash" onclick="clearRating()" src="img/${img}.svg"  alt="Очистить рейтинг" title="Очистить рейтинг"></div>
</div>
    <table>
        <tr>
            <th class="rate">#</th>
            <th class="name">имя</th>
            <th class="time">время, с</th>
        </tr>`;

    for (let i = 0; i < rating.length; i++) {
        const [name, time] = rating[i];
        html += `<tr>
        <td class="rate">${i + 1}</td>
        <td class="name">${name}</td>
        <td class="time">${time.toFixed(1)}</td>
    </tr>`
    }
    html += `</table>`;
    getEl('container__rating').innerHTML = html;
}

/**
 * Отрисовка таблицы Шульта
 */
function drawShult () {
    nextIndex = 0;
    sortedArr = getSequenceArray(MIN_NUM, MAX_NUM); // запоминаем последовательность для контроля прохождения
    shultArr = [...sortedArr];
    shuffleArray(shultArr);
    let html = '<table>';
    for (let r = 0; r < ADGE_LEN; r++) {
        html += `<tr id="tr${r + 1}" class="trClass">`;
        for (let c = 0; c < ADGE_LEN; c++) {
            html += `<td class="td" id="td${shultArr[r * ADGE_LEN + c]}" onclick="cellClick(this)">${shultArr[r * ADGE_LEN + c]}</td>`;
        }
        html += `</tr>`;
    }
    html += `</table>`;
    getEl('shult').innerHTML = html;
    shultSize()
}

/**
 * Возвращает время, затраченное игроком на таблицу на данный момент в секундах с десятыми долями.
 * @return {number}
 */
function getTime () {
    const now = +(new Date());
    timer = now - startTS;
    return Math.round(timer / 100) / 10;
}

function drawTime () {
    getEl('timer').innerText = `${getTime().toFixed(1)} с`;
}

/**
 * Отрисовывает прогресс-бар и возвращает актуальное значение прогресса
 * @return {Number}
 */
function drawProgress () {
    // Если не isStarted - скрываем
    const plStyle = getStyle('progressLine');
    if (!isStarted) {
        plStyle.visibility = 'hidden';
        return 0;
    }
    plStyle.visibility = 'visible';
    const pbStyle = getStyle('progressBar');
    if (!nextIndex || !sortedArr.length) {
        pbStyle.width = '0';
        return 0;
    }

    if (nextIndex >= sortedArr.length) {
        pbStyle.width = '100%';
        return 100;
    }

    const percent = Math.round((nextIndex / sortedArr.length) * 1000) / 10;
    pbStyle.width = `${percent.toFixed(1)}%`;
    return percent;
}

function playHappySound () {
    if (isPlaying) {
        let audio = new Audio();
        audio.src = 'sounds/happy.mp3';
        audio.autoplay = true;
    }
}

function stop () {
    const percent = drawProgress();
    isStarted = false;
    getEl('startStopBtn').src = 'img/play.svg';
    getEl('container__name').disabled = false;
    drawTime();
    if (percent > 99.99) {
        updateRating(); // Обновляем рейтинг игрока в памяти
        playHappySound();
        notify('Игра пройдена! Ваш результат: ' + getTime() + 'с', 5000);
        if (!isCheating) {
            bigAnim.start()
        } else {
            isCheating = false
        }

    }
    saveRating();
    drawRating();
    startTS = 0;
}

function checkName () {
    const nameEl = getEl('container__name');
    const name = nameEl.value.trim();
    if (!name) {
        notify("Введите имя")
        blinkName();
        return false;
    }
    return true;
}

function blinkName () {
    const nameStyle = getStyle('container__name');
    nameStyle.backgroundColor = '#ffc0c0'
    setTimeout(() => {
        nameStyle.backgroundColor = 'transparent';
    }, 200)
}


function start () {
    if (!checkName()) {
        return;
    }
    isStarted = true;
    startTS = +(new Date());
    getEl('startStopBtn').src = 'img/stop.svg';
    getEl('container__name').disabled = true;
    drawShult();
    drawProgress();
}

function startStop () {
    if (isStarted) {
        stop();
    } else {
        start();
    }
}

function good (tdEl) {
    nextIndex++;
    blinkCell(tdEl, 'lime');
    if (nextIndex >= sortedArr.length) {
        startStop();
    } else {
        drawProgress();
    }
}

function blinkCell (tdEl, color) {
    tdEl.style.backgroundColor = color;
    setTimeout(() => {
        tdEl.style.backgroundColor = 'transparent';
    }, 200)
}

function bad (tdEl) {
    blinkCell(tdEl, 'red');
}

function blinkStartButton () {
    const startStopBtn = getEl('startStopBtn');
    startStopBtn.src = 'img/play-red.svg';
    setTimeout(() => {
        startStopBtn.src = 'img/play.svg';
    }, 200)
}

function cellClick (tdEl) {
    if (!checkName()) {
        return;
    }
    if (!isStarted) {
        notify('Нажмите кнопку "Старт"')
        return blinkStartButton();
    }
    let num = tdEl.innerText;
    if (!/^\d+$/.test(num)) {
        return; // если содержимое элемента, на котором кликнули, не является числом, то ничего не делаем
    }
    num = +num;
    if (num === sortedArr[nextIndex]) {
        good(tdEl);
    } else {
        bad(tdEl);
        errorSound()
    }
}

function changeSoundBtn () {
    if (isPlaying && !theme) {
        getEl('container__offOnVolumeBtn').src = 'img/volume-offNight.svg';
        return isPlaying = false
    }
    if (!isPlaying && !theme) {
        getEl('container__offOnVolumeBtn').src = 'img/volume-onNight.svg';
        return isPlaying = true
    }
    if (isPlaying && theme) {
        getEl('container__offOnVolumeBtn').src = 'img/volume-off.svg';
        return isPlaying = false
    }
    if (!isPlaying && theme) {
        getEl('container__offOnVolumeBtn').src = 'img/volume-on.svg'
        return isPlaying = true
    }
}

function randomSec () {
    return (Math.floor(Math.random() * (50 - 10)) + 10) * 10;
}

function cheatClick () {

    const tdEl = getEl('td' + (nextIndex + 1))
    tdEl.click()

    cheat()

}

let theme = true;

function changeTheme () {
    if (theme) {
        nightTheme()
    } else {
        dayTheme()
    }
}

function nightTheme () {
    getEl('mainStyle').href = 'css/mainNight.css'
    getEl('ratingStyle').href = 'css/ratingNight.css'
    getEl('shultStyle').href = 'css/shultNight.css'
    getEl('container__offOnVolumeBtn').src = 'img/volume-onNight.svg'
    getEl('trash').src = 'img/trashNight.svg'
    theme = false;
    getEl('container__changeThemeBtn').src = 'img/sun.svg'
}

function dayTheme () {
    getEl('mainStyle').href = 'css/main.css'
    getEl('ratingStyle').href = 'css/rating.css'
    getEl('shultStyle').href = 'css/shult.css'
    getEl('container__offOnVolumeBtn').src = 'img/volume-on.svg'
    getEl('trash').src = 'img/trash.svg'
    theme = true;
    getEl('container__changeThemeBtn').src = 'img/crescent.svg'
}

let isDisplaying = false

function displayHints () {
    let hintsStyle = getStyle('hints')
    if (!isDisplaying) {
        hintsStyle.display = 'block'
        getEl('displayHints').innerText = 'скрыть подсказку'
        return isDisplaying = true
    }
    hintsStyle.display = 'none'
    getEl('displayHints').innerText = 'показать подсказку'
    return isDisplaying = false

}

let cheathelp;
let sec;

function cheat () {

    cheathelp = nextIndex

    if (cheathelp < 1) {
        sec = randomSec()
    }

    if (!getEl('container__name').value) {
        notify('Введите имя')
        return false
    }

    if (!isStarted) {
        start()
    }

    if (cheathelp === ADGE_LEN ** 2) {
        stop()
        return false
    }

    isCheating = true

    setTimeout(cheatClick, sec)
}

function helpMe () {
    if (!isStarted) {
        return false
    }

    if (nextIndex === ADGE_LEN ** 2) {
        stop()
    }


    const tdEl = getEl('td' + (nextIndex + 1))
    tdEl.style.backgroundColor = 'yellow'
    setTimeout(() => {
        tdEl.style.backgroundColor = 'transparent';
    }, 200)
}

let cursor = 0;
const KONAMI_CODE = [67, 72, 69, 65, 84];
document.addEventListener('keydown', (e) => {
    cursor = (e.keyCode === KONAMI_CODE[cursor]) ? cursor + 1 : 0;
    if (cursor === KONAMI_CODE.length) cheat();
});

let cursor2 = 0;
const HELP_CODE = [72];
document.addEventListener('keydown', (e) => {
    cursor2 = (e.keyCode === HELP_CODE[cursor2]) ? cursor2 + 1 : 0;
    if (cursor2 === HELP_CODE.length) helpMe();
});

function errorSound () {
    if (isPlaying) {
        let audio = new Audio();
        audio.src = 'sounds/error.mp3';
        audio.autoplay = true;
    }
}

function notify (html, delay = 3000) {
    const el = getEl('notify');
    el.innerHTML = html;
    el.style.display = 'block';
    setTimeout(() => {
        el.style.display = 'none';
    }, delay)
}


function onLoad () {
    getName();
    setDimension();
    getRating();
    drawRating();
    drawShult();
}

setInterval(() => {
    if (isStarted) {
        drawTime();
    }
}, 50)
