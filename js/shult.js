let MIN_NUM = 1;
let ADGE_LEN = 2; // Длина стороны квадрата
let MAX_NUM = (ADGE_LEN ** 2) + MIN_NUM - 1; //  5 ** 2 = 25; 25 - 1 + 1 == 25
let nextIndex = 0;
let sortedArr = [];
let shultArr = [];
let timer = 0;
let startTS = 0;
let isStarted = false;
let rating = []


function getEl (id) {
    return document.getElementById(id);
}

function getStyle (id) {
    const el = getEl(id)
    return el && el.style;
}

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


function drawRating () {

}

function drawShult () {

}

function onLoad () {
    drawRating();
    drawShult();
}
