type TotalGridColumns = 5
type TotalGridRows = 5

type GridSize = Multiply<TotalGridColumns, TotalGridRows>
type CleanBoard = MkGrid<GridSize>

type InitialGameState = MkGameState<{
    Inputs: [
        // { action: "RIGHT", atTick: 0 },
        // { action: "RIGHT", atTick: 0 },
        // { action: "RIGHT", atTick: 0 },
        // { action: "RIGHT", atTick: 0 },
        // { action: "RIGHT", atTick: 0 },
        // { action: "RIGHT", atTick: 0 },
        // { action: "LEFT", atTick: 1 },
        // { action: "LEFT", atTick: 2 },
        { action: "RIGHT", atTick: 5 },
        { action: "RIGHT", atTick: 5 },
    ]
    currentTick: 0
    LockedTiles: []
    FallingPiece: TetrominoToCoordinates<Tetrominoes["S"]>
    Board: RenderCellsOnGrid<InitialGameState["FallingPiece"], CleanBoard>,
}>

type RawGameLoop = GameLoop<InitialGameState>
type LastGameState = Run<InitialGameState, 1>

type LastBoardState = LastGameState["Board"]
type LastPieceState = LastGameState["FallingPiece"]
type LastLockedTilesState = LastGameState["LockedTiles"]

type lmao = IsWithinBoundaries<LastPieceState>
type lmao2 = IsOverlapping<LastPieceState, LastLockedTilesState>
type lmao3 = CanMove<LastPieceState, LastLockedTilesState>
type lmao4 = ApplyMoves<LastPieceState, InitialGameState["Inputs"]> 

type Display = GridToDisplay<LastBoardState>