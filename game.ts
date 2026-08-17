type MkGameState<T extends GameState> = T
type GameState = {
    Board: Grid
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

type CanMove<Pieces extends Grid, Occupied extends Grid, Direction extends Move = 'DOWN'> = IsWithinBoundaries<Pieces> extends true ? 
    IsOverlapping<Pieces, Occupied> extends false ? true : false 
    : false

type ApplyGravity<Cells extends Grid, UpdatedCells extends Cell[] = []> = Cells extends [infer Head extends Cell, ...infer Rest extends Grid] ?
    ApplyGravity<Rest, [{ value: Head["value"], x: Head["x"], y: Minus<Head["y"], 1> }, ...UpdatedCells]>
    : UpdatedCells

type GameLoop<State extends GameState> = ApplyGravity<State["FallingPiece"]> extends infer UpdatedPiece extends Cell[] ?
    CanMove<UpdatedPiece, State["LockedTiles"]> extends true ?
        MkGameState<{ FallingPiece: UpdatedPiece, Board: RenderCellsOnGrid<[...UpdatedPiece, ...State["LockedTiles"]], CleanBoard>, LockedTiles: State["LockedTiles"] }>
        : MkGameState<{ 
            FallingPiece: TetrominoToCoordinates<Tetrominoes["I"]>, 
            Board: RenderCellsOnGrid<[...State["FallingPiece"], ...State["LockedTiles"]], CleanBoard>, 
            LockedTiles: [...State["FallingPiece"], ...State["LockedTiles"]] }> 
    : never

type Run<InitialState extends GameState, Amount extends number> = 
    Amount extends 0 ? InitialState : Run<GameLoop<InitialState>, Minus<Amount, 1>>