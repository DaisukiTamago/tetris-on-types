type MkGameState<State extends GameState, Overrides extends { [K in keyof GameState]?: GameState[K] } = {}> =
    { [K in keyof State | keyof Overrides]: K extends keyof Overrides ? Overrides[K] : K extends keyof State ? State[K] : never }

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
        : { y: IsGreaterThanOrEqual<Piece["y"], 0>, x: isWithinInclusiveRange<Piece["x"], { min: 0, max: Minus<TotalGridColumns, 1> }> } extends { x: true, y: true } ? 
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

type ApplyMoves<Piece extends Cell[], Moves extends GameInput[], Occupied extends Cell[] = []> = 
    Moves["length"] extends 0 ? Piece :
    Moves extends [infer Head extends GameInput, ...infer Rest extends GameInput[]] ? 
        ApplyMove<Piece, Head["action"]> extends infer UpdatedPiece extends Cell[] ? 
            CanMove<UpdatedPiece, Occupied> extends true ? 
                ApplyMoves<UpdatedPiece, Rest, Occupied> 
                : ApplyMoves<Piece, Rest, Occupied> 
            : never
    : never

type ApplyMove<Pieces extends Cell[], Direction extends Move, UpdatedCells extends Cell[] = []> = 
    Pieces extends [infer Head extends Cell, ...infer Rest extends Grid] ?
        ApplyMove<Rest, Direction, [ApplyMoveToTile<Head, Direction>, ...UpdatedCells]>
        : UpdatedCells

type ApplyMoveToTile<Tile extends Cell, Direction extends Move> = 
    Direction extends "LEFT" ? { value: Tile["value"], x: Minus<Tile["x"], 1>, y: Tile["y"] } 
        : Direction extends "RIGHT" ? { value: Tile["value"], x: Sum<Tile["x"], 1>, y: Tile["y"] } 
            : Direction extends "DOWN" ? { value: Tile["value"], x: Tile["x"], y: Minus<Tile["y"], 1> } : never 

type CheckFilledLines<OccupiedTiles extends Grid, LastCheckedRow extends number = 0, ClearedTiles extends Grid = []> =
    GetRowAt<OccupiedTiles, LastCheckedRow> extends infer CheckedRow extends Grid ? 
        SizeOf<CheckedRow> extends 0 ? 
        ClearedTiles
        : SizeOf<CheckedRow> extends TotalGridColumns ? 
            CheckFilledLines<ApplyMove<FilterOut<OccupiedTiles, { y: LastCheckedRow }>, "DOWN">, LastCheckedRow, [...ClearedTiles]> 
            : CheckFilledLines<OccupiedTiles, Sum<LastCheckedRow, 1>, [...ClearedTiles, ...CheckedRow]>
    : never

type GameLoop<State extends GameState> =   
    Filter<State["Inputs"], { atTick: State["currentTick"] }> extends infer DesiredMoves extends GameInput[] ?
        ApplyMoves<State["FallingPiece"], DesiredMoves, State["LockedTiles"]> extends infer MovedPiece extends Cell[] ?
            ApplyMove<MovedPiece, "DOWN"> extends infer PulledDownPiece extends Cell[] ? 
                CanMove<PulledDownPiece, State["LockedTiles"]> extends true ? 
                    MkGameState<State, { 
                        FallingPiece: PulledDownPiece, 
                        Board: RenderCellsOnGrid<[...PulledDownPiece, ...State["LockedTiles"]], CleanBoard>, 
                        currentTick: Sum<State["currentTick"], 1>}> 
                    : CheckFilledLines<[...MovedPiece, ...State["LockedTiles"]]> extends infer CheckedRows extends Grid ? 
                        MkGameState<State, { 
                            LockedTiles: CheckedRows
                            Board: RenderCellsOnGrid<[...NextTetromino<1>, ...CheckedRows], CleanBoard>, 
                            FallingPiece: NextTetromino<1>
                            currentTick: Sum<State["currentTick"], 1> }>
                        : never
            : never  
        : never
    : never

type Run<InitialState extends GameState, MaxTick extends number> = 
    MaxTick extends InitialState["currentTick"] ? InitialState 
    : GameLoop<InitialState> extends infer NextState extends GameState ? 
        [Run<NextState, MaxTick>] extends [infer LoopResult] ? LoopResult : never
        : never
