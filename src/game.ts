type MkGameState<State extends GameState, Overrides extends { [K in keyof GameState]?: GameState[K] } = {}> =
    {
        [K in keyof State | keyof Overrides]:
            K extends keyof Overrides ?
                Overrides[K]
            : K extends keyof State ?
                State[K]
            : never
    }

type GameState = {
    currentTick: number
    Board: Grid
    Inputs: readonly Move[][]
    FallingPiece: Cell[]
    LockedTiles: Cell[]
    IsGameOver: boolean
    Score: number
}

type IsWithinBoundaries<Pieces extends Cell[], Result extends boolean = false> =
    Pieces extends [infer Piece extends Cell, ...infer Rest extends Cell[]] ?
        Piece["y"] extends never ?
            false
        : Piece["x"] extends never ?
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

type CanMove<Pieces extends Grid, Occupied extends Grid> =
    IsWithinBoundaries<Pieces> extends true ?
        IsOverlapping<Pieces, Occupied> extends false ? true : false
    : false

type ApplyMoves<Piece extends Cell[], Moves extends Move[], Occupied extends Cell[] = []> =
    Moves["length"] extends 0 ?
        Piece
    : Moves extends [infer Head extends Move, ...infer Rest extends Move[]] ?
        ApplyMove<Piece, Head> extends infer UpdatedPiece extends Cell[] ?
            CanMove<UpdatedPiece, Occupied> extends true ?
                ApplyMoves<UpdatedPiece, Rest, Occupied>
            : ApplyMoves<Piece, Rest, Occupied>
        : never
    : never

type ApplyMove<Pieces extends Cell[], Direction extends Move, UpdatedCells extends Cell[] = []> =
    Direction extends "UP" ?
        Rotate<Pieces>
    : Pieces extends [infer Head extends Cell, ...infer Rest extends Grid] ?
        ApplyMove<Rest, Direction, [ApplyMoveToTile<Head, Direction>, ...UpdatedCells]>
    : UpdatedCells

type ApplyMoveToTile<Tile extends Cell, Direction extends Move> =
    Direction extends "LEFT" ?
        { value: Tile["value"], x: Minus<Tile["x"], 1>, y: Tile["y"] }
    : Direction extends "RIGHT" ?
        { value: Tile["value"], x: Sum<Tile["x"], 1>, y: Tile["y"] }
    : Direction extends "DOWN" ?
        { value: Tile["value"], x: Tile["x"], y: Minus<Tile["y"], 1> }
    : never

type Rotate<
    OriginalTiles extends Cell[],
    Box extends { min: Coordinate, max: Coordinate } = GetMinAndMaxCoordinates<OriginalTiles>,
    RotatedTiles extends Cell[] = []
> =
    OriginalTiles extends [infer Tile extends Cell, ...infer Rest extends Cell[]] ?
        Minus<Tile["x"], Box["min"]["x"]> extends infer LocalX extends number ?
            Minus<Tile["y"], Box["min"]["y"]> extends infer LocalY extends number ?
                Minus<Minus<Box["max"]["y"], Box["min"]["y"]>, LocalY> extends infer NewX extends number ?
                    Rotate<Rest, Box, [
                        { value: Tile["value"], x: Sum<NewX, Box["min"]["x"]>, y: Sum<LocalX, Box["min"]["y"]> },
                        ...RotatedTiles
                    ]>
                : never
            : never
        : never
    : RotatedTiles

type CheckFilledLines<OccupiedTiles extends Cell[], LastCheckedRow extends number = 0, Result extends { clearedTiles: Cell[], score: number } = { clearedTiles: [], score: 0 }> =
    GetRowAt<OccupiedTiles, LastCheckedRow> extends infer CheckedRow extends Grid ?
        SizeOf<CheckedRow> extends 0 ?
            Result
        : FilterOut<OccupiedTiles, { y: LastCheckedRow }> extends infer RemainingTiles extends Cell[] ?
            SizeOf<CheckedRow> extends TotalGridColumns ?
                CheckFilledLines<ApplyMove<RemainingTiles, "DOWN">, LastCheckedRow, { clearedTiles: [...Result["clearedTiles"]], score: Sum<Result["score"], 1> }>
            : CheckFilledLines<RemainingTiles, Sum<LastCheckedRow, 1>, { clearedTiles: [...Result["clearedTiles"], ...CheckedRow], score: Result["score"] }>
        : never
    : never

type MovesAt<State extends GameState> =
    State["Inputs"][State["currentTick"]] extends infer Moves extends Move[] ?
        Moves
    : []

type GameLoop<State extends GameState> =
    State["IsGameOver"] extends false ?
        MovesAt<State> extends infer DesiredMoves extends Move[] ?
            ApplyMoves<State["FallingPiece"], DesiredMoves, State["LockedTiles"]> extends infer MovedPiece extends Cell[] ?
                Mod<State["currentTick"], 4> extends 3 ?
                    ApplyMove<MovedPiece, "DOWN"> extends infer PulledDownPiece extends Cell[] ?
                        CanMove<PulledDownPiece, State["LockedTiles"]> extends true ?
                            MkGameState<State, {
                                FallingPiece: PulledDownPiece,
                                Board: RenderCellsOnGrid<[...PulledDownPiece, ...State["LockedTiles"]], CleanBoard>,
                                currentTick: Sum<State["currentTick"], 1>
                            }>
                        : CheckFilledLines<[...MovedPiece, ...State["LockedTiles"]]> extends infer CheckedRows extends { clearedTiles: Cell[], score: number } ?
                            NextTetromino<State["currentTick"]> extends infer NextPiece extends Cell[] ?
                                IsOverlapping<NextPiece, CheckedRows["clearedTiles"]> extends true ?
                                    MkGameState<State, { Board: GameOverBoard, FallingPiece: [], LockedTiles: [], IsGameOver: true }>
                                : MkGameState<State, {
                                    LockedTiles: CheckedRows["clearedTiles"]
                                    Board: RenderCellsOnGrid<[...NextPiece, ...CheckedRows["clearedTiles"]], CleanBoard>,
                                    FallingPiece: NextPiece
                                    Score: Sum<State["Score"], CheckedRows["score"]>
                                    currentTick: Sum<State["currentTick"], 1>
                                }>
                            : never
                        : never
                    : never
                : CanMove<MovedPiece, State["LockedTiles"]> extends true ?
                    MkGameState<State, {
                        FallingPiece: MovedPiece,
                        Board: RenderCellsOnGrid<[...MovedPiece, ...State["LockedTiles"]], CleanBoard>,
                        currentTick: Sum<State["currentTick"], 1>
                    }>
                : MkGameState<State, { currentTick: Sum<State["currentTick"], 1> }>
            : never
        : never
    : MkGameState<State, { Board: GameOverBoard, FallingPiece: [], LockedTiles: [], IsGameOver: true }>

type Run<InitialState extends GameState, MaxTick extends number> =
    MaxTick extends InitialState["currentTick"] ?
        InitialState
    : GameLoop<InitialState> extends infer NextState extends GameState ?
        [Run<NextState, MaxTick>] extends [infer LoopResult] ?
            LoopResult
        : never
    : never
