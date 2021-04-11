function shultSize () {
    let shultCellSize = ADGE_LEN * -5 + 100
    let shultCellFontSize = ADGE_LEN * -4 + 60
    const tds = document.getElementsByClassName('td')
    for (let td of tds) {
        td.style.fontSize = shultCellFontSize + 'px'
        td.style.width = shultCellSize + 'px'
        td.style.height = shultCellSize + 'px'
    }

    getStyle('center').width = Math.max(ADGE_LEN, 5) * shultCellSize + 'px'
}

