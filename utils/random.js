const randomArray = function (size) {
    const array = []
    for (let i = 0; i < size; i++) {
        const r = Math.random()
        if (r >= 0.5) {
            array.push(1)
        } else {
            array.push(-1)
        }
    }
    return array
}

export {
    randomArray
}