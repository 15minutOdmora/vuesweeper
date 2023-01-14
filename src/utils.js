export const totalNumberOfBombs = 14
export const surroundingIndexes = [-1 ,0, 1] 

export function getIndex(row, column) {
    if (row < 0 || column < 0) return
    if (row > 9 || column > 9) return
    
    return row * 10 + column
}

export function getCoordinates(index) {
    return {
        row: Math.floor(index / 10),
        column: index % 10,
    };
}

export function generateTiles (amount) {
    const squaredAmount = amount * amount
    const bombs = Array.from({ length: squaredAmount })

    const bombPercentage = 0.15

    for (let i = 0; i < bombs.length; i++) {
        if (Math.random() <= bombPercentage) {
            bombs[i] = 1
        }
    }
    console.log(bombs)
    return bombs.map((bomb, index, array) => {
        const { row, column } = getCoordinates(index)

        let surroundingBombs = 0;

        for (const i of surroundingIndexes) {
            for (const j of surroundingIndexes) {
                if (array[getIndex(row + i, column + j)]) {
                    surroundingBombs++
                }
            }
        }

        return { bomb, surroundingBombs, flagged: false, revealed: false }
    })
}