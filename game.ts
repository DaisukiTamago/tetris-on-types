type MkGameState<T extends GameState> = T

type GameInput = {
    action: Move
    atTick: number
}

type GameState = {
    currentTick: number
    Board: Grid
    Inputs: GameInput[]
    FallingPiece: Cell[]
    LockedTiles: Cell[]
}

type IsWithinBoundaries<Pieces extends Cell[], Result extends boolean = false> = 
    Pieces extends [infer Piece extends Cell, ...infer Rest extends Cell[]] ?
        Piece["y"] extends never ?
        false
        : { y: IsGreaterThanOrEqual<Piece["y"], 0>, x: isWithinInclusiveRange<Piece["x"], { min: 0, max: TotalGridColumns }> } extends { x: true, y: true } ? 
            IsWithinBoundaries<Rest, true> 
            : false
    : Result

type IsOverlapping<Piece extends Cell[], Occupied extends Cell[], Result extends boolean = false> = 
    Occupied extends [infer Head extends Cell, ...infer Rest extends Cell[]] ? 
        Includes<Piece, CoordsFromCell<Head>> extends Cell ?
            true 
            : IsOverlapping<Piece, Rest, false>
        : Result

type CanMove<Pieces extends Grid, Occupied extends Grid> = IsWithinBoundaries<Pieces> extends true ? 
    IsOverlapping<Pieces, Occupied> extends false ? true : false 
    : false

type ApplyMove<Pieces extends Cell[], Direction extends Move, UpdatedCells extends Cell[] = []> = 
    Pieces extends [infer Head extends Cell, ...infer Rest extends Grid] ?
        ApplyMove<Rest, Direction, [ApplyMoveToTile<Head, Direction>, ...UpdatedCells]>
        : UpdatedCells

type ApplyMoveToTile<Tile extends Cell, Direction extends Move> = 
    Direction extends "LEFT" ? { value: Tile["value"], x: Minus<Tile["x"], 1>, y: Tile["y"] } 
        : Direction extends "RIGHT" ? { value: Tile["value"], x: Sum<Tile["x"], 1>, y: Tile["y"] } 
            : Direction extends "DOWN" ? { value: Tile["value"], x: Tile["x"], y: Minus<Tile["y"], 1> } : never 

type GameLoop<State extends GameState> = 
    ApplyMove<State["FallingPiece"], "DOWN"> extends infer UpdatedPiece extends Cell[] ?
        CanMove<UpdatedPiece, State["LockedTiles"]> extends true ?
            MkGameState<{
                currentTick: 0
                FallingPiece: UpdatedPiece,
                Inputs: State["Inputs"] 
                Board: RenderCellsOnGrid<[...UpdatedPiece, ...State["LockedTiles"]], CleanBoard>, 
                LockedTiles: State["LockedTiles"] }>
            : MkGameState<{
                currentTick: 0
                Inputs: State["Inputs"]
                FallingPiece: TetrominoToCoordinates<Tetrominoes["J"]>, 
                Board: RenderCellsOnGrid<[...TetrominoToCoordinates<Tetrominoes["J"]>, ...State["FallingPiece"], ...State["LockedTiles"]], CleanBoard>, 
                LockedTiles: [...State["FallingPiece"], ...State["LockedTiles"]] }> 
    : never

type Run<InitialState extends GameState, Amount extends number> = 
    Amount extends 0 ? InitialState : Run<GameLoop<InitialState>, Minus<Amount, 1>>