type Colors = {
    BLACK: "⬛";
    RED:   "🟥",
    GREEN: "🟩",
    BLUE:  "🟦",
    WHITE: "⬜"
}

type Move = "UP" | "LEFT" | "RIGHT" | "DOWN"

type Tetrominoes = {
    T: 
    `⬛⬛⬛
     ⬜⬛⬜`,
     S: 
    `⬜⬛⬛
     ⬛⬛⬜`
     O: 
    `⬛⬛
     ⬛⬛`
    L: 
    `⬛⬛⬛
     ⬛⬜⬜`
    I: `⬛⬛⬛⬛`,
    Z: Tetrominoes["S"]
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

type NextTetromino<Seed extends number> = TetrominoToCoordinates<Tetrominoes["T"]>