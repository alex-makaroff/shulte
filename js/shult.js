let MIN_NUM = 1;
let ADGE_LEN = 2; // Длина стороны квадрата
let MAX_NUM = (ADGE_LEN ** 2) + MIN_NUM - 1; //  5 ** 2 = 25; 25 - 1 + 1 == 25
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

function drawShult () {

}

function onLoad () {
    drawRating();
    drawShult();
}
