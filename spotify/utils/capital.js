export const capital = (string) => {
    const result = string.split(' ').map(word => word[0].toUpperCase() + word.substr(1) ).join(' ')
    return result 
}