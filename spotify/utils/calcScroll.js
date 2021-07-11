export const calcScroll = (eleHeight) => {
    // const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    // const height = eleHeight ? eleHeight : document.documentElement.scrollHeight - document.documentElement.clientHeight;
    // const percent = (winScroll / height) * 100
    // return percent
    const mainScroll = document.querySelector('.dashboard')
    const height =  mainScroll.clientHeight
    const scrollHeight = eleHeight ? eleHeight : mainScroll.scrollHeight - height
    const scrollTop = mainScroll.scrollTop
    const percent = Math.floor(scrollTop / scrollHeight * 100)
    return percent
}