export const calcScroll = (eleHeight) => {
    const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    const height = eleHeight ? eleHeight : document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const percent = (winScroll / height) * 100
    return percent
}