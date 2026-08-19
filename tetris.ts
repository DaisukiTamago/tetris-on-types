type TotalGridColumns = 4
type TotalGridRows = 5

type GridSize = Multiply<TotalGridColumns, TotalGridRows>
type CleanBoard = MkGrid<GridSize>

type InitialGameState = MkGameState<{
    Inputs: [
        { action: "RIGHT", atTick: 4 },
        { action: "RIGHT", atTick: 4 },
        { action: "RIGHT", atTick: 12 },
        { action: "RIGHT", atTick: 12 },
    ]
    currentTick: 0
    LockedTiles: []
    FallingPiece: NextTetromino<InitialGameState["currentTick"]>
    Board: RenderCellsOnGrid<InitialGameState["FallingPiece"], CleanBoard>,
}>

type RawGameLoop = GameLoop<InitialGameState>
type LastGameState = Run<InitialGameState, 4>

type LastBoardState = LastGameState["Board"]
type LastPieceState = LastGameState["FallingPiece"]
type LastLockedTilesState = LastGameState["LockedTiles"]

type lmao = IsWithinBoundaries<LastPieceState>
type lmao2 = IsOverlapping<LastPieceState, LastLockedTilesState>
type lmao3 = CanMove<LastPieceState, LastLockedTilesState>
type lmao4 = ApplyMoves<LastPieceState, InitialGameState["Inputs"]> 
type lmao5 = CheckFilledLines<LastLockedTilesState>

type Display = GridToDisplay<LastBoardState>