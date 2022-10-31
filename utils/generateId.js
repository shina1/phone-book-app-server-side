export const generateId = (arr) =>{
    const highestId = arr.length > 0 ? Math.max(...arr.map(el => el.id)) : 0
    return highestId + 1
}

