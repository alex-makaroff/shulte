let MIN_NUM;
let ADGE_LEN; // Длина стороны квадрата
let MAX_NUM; //  5 ** 2 = 25; 25 - 1 + 1 == 25
let nextIndex = 0;
let sortedArr = [];
let shultArr = [];
let timer = 0;
let startTS = 0;
let isStarted = false;
let rating = [
    ["Саша", 6.0],
    ["Вениамин", 10.0],
    ["Света", 85.5],
    ["Юра", 45.5],
    ["Екатерина", 31.5],
    ["Петр", 36.5],
];

function setDimension(adgeLen = 5, minNum = 1){
    MIN_NUM = minNum;

    adgeLen = Math.floor(adgeLen);
    adgeLen = Math.min(10, adgeLen);
    adgeLen = Math.max(2, adgeLen);
    ADGE_LEN = adgeLen;

    MAX_NUM = (ADGE_LEN ** 2) + MIN_NUM - 1; //  5 ** 2 = 25; 25 + 1 - 1 == 25
}

setDimension();

function getEl (id) {
    return document.getElementById(id);
}

function getStyle (id) {
    const el = getEl(id)
    return el && el.style;
}


/**
 * возвращает массив последовательных целых чисел от min до max
 * @param {Number} min
 * @param {Number} max
 * @return {Number[]}
 */
function getSequenceArray (min, max) {
    return [...Array(max - min + 1).keys()].map((i) => i + min);
}

/**
 * Перемещивает массив случайным образом
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
    rating.sort((a, b) => {
        return a[1] - b[1];
    });
}

/**
 * Обновление рейтинга игрока в памяти
 */
function updateRating () {
    const name = getEl('name').value.trim();
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


/**
 * Отрисовка таблицы рейтинга
 */
function drawRating () {
    sortRating();

    let html = `<div>Рейтинг</div>
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
    getEl('rating').innerHTML = html;
}

function blinkName () {
    const nameStyle = getStyle('name');
    nameStyle.backgroundColor = '#ffc0c0'
    setTimeout(() => {
        nameStyle.backgroundColor = 'transparent';
    }, 200)
}

function start () {
    const nameEl = getEl('name');
    const name = nameEl.value.trim()
    if (!name) {
        return blinkName();
    }
    isStarted = true;
    startTS = +(new Date());
    getEl('startStopBtn').src = 'img/stop.svg';
    nameEl.disabled = true;
    drawShult();
    drawProgress();
}

function stop () {
    const percent = drawProgress();
    isStarted = false;
    getEl('startStopBtn').src = 'img/play.svg';
    getEl('name').disabled = false;
    drawTime();
    if (percent > 99.99) {
        updateRating(); // Обновляем рейтинг игрока в памяти
    }
    saveRating();
    startTS = 0;
    drawRating();
}

function startStop () {
    if (isStarted) {
        stop();
    } else {
        start();
    }
}

function drawProgress () {
    //если не isStarted, то скрываем
    const plStyle = getStyle('progressLine')
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

/**
 * Отрисовка таблицы Шульта
 */
function drawShult () {
    nextIndex = 0;
    sortedArr = getSequenceArray(MIN_NUM, MAX_NUM);
    shultArr = [...sortedArr]
    shuffleArray(shultArr)

    // Накрутить строку HTML-таблицу
    let html = `<table id="shult">`;
    // Таблица выглядит примерно так:
    for (let r = 0; r < ADGE_LEN; r++) {
        html += `<tr>`
        for (let c = 0; c < ADGE_LEN; c++) {
            html += `<td onclick="cellClick(this)">${shultArr[r * ADGE_LEN + c]}</td>`
        }
        html += `</tr>`
    }
    html += `</table>`;
    getEl('shult').innerHTML = html;
}

function blinkCell (tdEl, color) {
    tdEl.style.backgroundColor = color;
    setTimeout(() => {
        tdEl.style.backgroundColor = 'transparent';
    }, 200)
}

function blinkStartButton () {
    const startStopBtn = getEl('startStopBtn');
    startStopBtn.src = 'img/play-red.svg';
    setTimeout(() => {
        startStopBtn.src = 'img/play.svg';
    }, 200)
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

function bad (tdEl) {
    blinkCell(tdEl, 'red');
}

function cellClick (tdEl) {
    if (!isStarted) {
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
    }
}

function onLoad () {
    getRating();
    drawRating();
    drawShult();
}


function getTime () {
    const now = +(new Date());
    timer = now - startTS;
    return Math.round(timer / 100) / 10;
}

function drawTime () {
    getEl('timer').innerText = `${getTime().toFixed(1)} с`;
}

setInterval(() => {
    if (isStarted) {
        drawTime();
    }
}, 50)
