const bigAnim = {
    ANIMATION_DELAY: 100,

    generateColor () {
        const r = Math.floor(Math.random() * 255)
        const g = Math.floor(Math.random() * 255)
        const b = Math.floor(Math.random() * 255)
        const color = `rgb(${r},${g},${b})`
        console.log(color);
        return color;
    },

    transpearingShult () {
        let trs = document.getElementsByClassName('trClass')
        for (let tr of trs) {
            tr.style.backgroundColor = 'transparent'
        }
    },

    blinkRow (rowNum, color, targetRow) {
        return new Promise((resolve, reject) => {
            let trStyle = getStyle('tr' + rowNum)
            trStyle.backgroundColor = color;
            setTimeout(() => {
                if (rowNum !== targetRow) {
                    trStyle.backgroundColor = 'transparent';
                }
                resolve();
            },  this.ANIMATION_DELAY)
        })
    },

    async follingRow (targetRow, color) {
        for (let cursor = 1; cursor <= targetRow; cursor++) {
            await this.blinkRow(cursor, color, targetRow);
        }
    },

    async fillGlass (direction) {
        for (let targetRow = ADGE_LEN; targetRow > 0; targetRow--) {
            let color = this.generateColor()
            await this.follingRow(targetRow, color);
        }
        setTimeout(this.transpearingShult, 500)
    },

    async start (direction = 'down') {
        await this.fillGlass(direction);
    },
}

