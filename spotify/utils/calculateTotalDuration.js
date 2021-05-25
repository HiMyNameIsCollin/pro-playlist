
export const calculateTotalDuration = ( tracks ) => {
    let total = 0
    tracks.map((single, i) => {
        total += single.duration_ms
    })
    const msToTime = ( duration ) => {
        let milliseconds = Math.floor((duration % 1000) / 100),
        seconds = Math.floor((duration / 1000) % 60),
        minutes = Math.floor((duration / (1000 * 60)) % 60),
        hours = Math.floor((duration / (1000 * 60 * 60)) % 24);
        hours = (hours > 0) ? (hours < 10) ? '0' + hours : hours : 0
        minutes = (minutes < 10) ? "0" + minutes : minutes;
        seconds = (seconds < 10) ? "0" + seconds : seconds;
        hours = (hours > 0) ? (hours > 1 ) ? hours + ' ' + 'hour' : hours + ' ' + 'hours' : false
        minutes = minutes + ' ' + 'minutes '
        seconds = seconds + ' ' + 'seconds '
        return hours ? hours + minutes + seconds : minutes + seconds
    }
    const readableDuration = msToTime(total)
    return readableDuration
}