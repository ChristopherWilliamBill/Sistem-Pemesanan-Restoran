export function timeCalculator(initialTime, currentTime) {
    const date = new Date()

    const toSeconds = (t) => {
        let x = t.split(':');
        return (x[0] * 3600) + (x[1] * 60) + (x[2] * 1)
    }

    const formatter = (n) => {return (n < 10 ? '0' : '') + n}

    const toHMS = (secs) => {
        return formatter(parseInt(secs/3600)) + 'h:' + formatter(parseInt(secs%3600/60)) + 'm:' + formatter(parseInt(secs%60)) + "s"
    }

    return toHMS(toSeconds(currentTime) - toSeconds(initialTime))
}

