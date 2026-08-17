type Colors = {
    BLACK: "⬛";
    RED:   "🟥",
    GREEN: "🟩",
    BLUE:  "🟦",
    WHITE: "⬜"
}

type Move = "DOWN" | "LEFT" | "RIGHT"

type Tetrominoes = {
    T: 
    `⬛⬛⬛
     ⬜⬛⬜`,
    I: `⬛⬛⬛⬛`,
    S: 
    `⬜⬛⬛
     ⬛⬛⬜`
    Z: Tetrominoes["S"]
    O: `⬛⬛
        ⬛⬛`
    L: `⬛⬛⬛
        ⬛⬜⬜`
    J: Tetrominoes["L"]
}

type TetrominoToCoordinates<Tetromino extends string, Acc extends Cell = { x: 0; y: Minus<TotalGridRows, 1>, value: Colors["BLUE"] }> = 
    Tetromino extends `${infer Head}${infer Rest}` ? 
        Head extends Colors["BLACK"] ? 
        [Acc, ...TetrominoToCoordinates<Rest, { x: Sum<Acc["x"], 1>, y: Acc["y"], value: Acc["value"] } >]
        : Head extends '\n' ? 
            [...TetrominoToCoordinates<Rest, { x: 0, y: Minus<Acc["y"], 1>, value: Acc["value"] } >] 
            : Head extends Colors["WHITE"] ? 
                [...TetrominoToCoordinates<Rest, { x: Sum<Acc["x"], 1>, y: Acc["y"], value: Acc["value"] } >]
                : Head extends ' ' ?
                    [...TetrominoToCoordinates<Rest, { x: Acc["x"], y: Acc["y"], value: Acc["value"] } >]
                    : []
    : []