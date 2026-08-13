type Colors = {
    BLACK: "⬛";
    RED:   "🟥",
    GREEN: "🟩",
    BLUE:  "🟦",
    WHITE: "⬜"
}

type Tetrominoes = {
    T: 
    `⬛⬛⬛
     ⬜⬛⬜`,
    I: `⬛⬛⬛⬛`,
    S: 
    `⬜⬛⬛
     ⬛⬛⬜`
    Z: Tetrominoes["S"]
    O: `
    ⬛⬛
    ⬛⬛
    `
    L: `
    ⬛⬛⬛
    ⬛⬜⬜
    `
    J: Tetrominoes["L"]
}

type TetrominoToCoordinates<Tetromino extends string, Acc extends Coordinate = { x: 0; y: 0 }> = 
    Tetromino extends `${infer Head}${infer Rest}` ? 
        Head extends Colors["BLACK"] ? 
        [Acc, ...TetrominoToCoordinates<Rest, { x: Sum<Acc["x"], 1>, y: Acc["y"] } >]
        : Head extends '\n' ? 
            [...TetrominoToCoordinates<Rest, { x: 0, y: Sum<Acc["y"], 1> } >] 
            : Head extends Colors["WHITE"] ? 
                [...TetrominoToCoordinates<Rest, { x: Sum<Acc["x"], 1>, y: Acc["y"] } >]
                : Head extends ' ' ?
                    [...TetrominoToCoordinates<Rest, { x: Acc["x"], y: Acc["y"] } >]
                    : []
    : []