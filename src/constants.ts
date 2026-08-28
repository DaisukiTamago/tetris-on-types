type Move = "UP" | "LEFT" | "RIGHT" | "DOWN"
type MkMove<T extends Move[][]> = T

// it seems like there is an official color pallete for these, so let's please them nerds
// https://tetris.fandom.com/wiki/Tetromino
type Colors = {
    RED:    "🟥";
    GREEN:  "🟩";
    BLUE:   "🟦";
    CYAN:   "🟫"; // there is no CYAN square emoji Q_Q
    YELLOW: "🟨";
    PURPLE: "🟪";
    ORANGE: "🟧";
    BLACK:  "⬛";
    WHITE:  "⬜";
}

type TetrominoType = { name: string, shape: string, color: Colors[keyof Colors]}
type MkTetrominoList<T extends readonly TetrominoType[]> = T

type TetrominoList = MkTetrominoList<[
    { name: "T", color: Colors["PURPLE"], shape:
    `⬛⬛⬛
     ⬜⬛⬜`, },
    { name: "S", color: Colors["GREEN"], shape:
    `⬜⬛⬛
     ⬛⬛⬜` },
    { name: "O", color: Colors["YELLOW"], shape:
    `⬛⬛
     ⬛⬛` },
    { name: "L", color: Colors["ORANGE"], shape:
    `⬛⬛⬛
     ⬛⬜⬜` },
    { name: "I", color: Colors["CYAN"], shape: `⬛⬛⬛⬛` },
    { name: "Z", color: Colors["RED"], shape: Mirror<TetrominoList[1]["shape"]> },
    { name: "J", color: Colors["BLUE"], shape: Mirror<TetrominoList[3]["shape"]> }
]>
type NumberOfTetrominoes = SizeOf<TetrominoList>

type TetrominoToCoordinates<Tetromino extends TetrominoType, Acc extends Cell = { x: 0; y: Minus<Config["rows"], 1>, value: Tetromino["color"] }> =
    Tetromino["shape"] extends `${infer Head}${infer Rest}` ?
        Head extends Colors["BLACK"] ?
            [Acc, ...TetrominoToCoordinates<{ shape: Rest, color: Tetromino["color"], name: Tetromino["name"] }, { x: Sum<Acc["x"], 1>, y: Acc["y"], value: Acc["value"] } >]
        : Head extends '\n' ?
            [...TetrominoToCoordinates<{ shape: Rest, color: Tetromino["color"], name: Tetromino["name"] }, { x: 0, y: Minus<Acc["y"], 1>, value: Acc["value"] } >]
        : Head extends Colors["WHITE"] ?
            [...TetrominoToCoordinates<{ shape: Rest, color: Tetromino["color"], name: Tetromino["name"] }, { x: Sum<Acc["x"], 1>, y: Acc["y"], value: Acc["value"] } >]
        : Head extends ' ' ?
            [...TetrominoToCoordinates<{ shape: Rest, color: Tetromino["color"], name: Tetromino["name"] }, { x: Acc["x"], y: Acc["y"], value: Acc["value"] } >]
        : []
    : []

type NextTetromino<Seed extends number> =
    Mod<Seed, NumberOfTetrominoes> extends infer Index extends number ?
        TetrominoToCoordinates<TetrominoList[Index]>
    : never
