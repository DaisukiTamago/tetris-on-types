type TotalGridColumns = 4
type TotalGridRows = 7

type GridSize = Multiply<TotalGridColumns, TotalGridRows>
type CleanBoard = MkGrid<GridSize>
type GameOverBoard = MkGrid<GridSize, { value: Colors["RED"], x: 0, y: 0, index: 0 } >

type InitialGameState = MkGameState<{
    Inputs: Inputs
    LockedTiles: []
    FallingPiece: NextTetromino<InitialGameState["currentTick"]>
    currentTick: 0
    Board: RenderCellsOnGrid<InitialGameState["FallingPiece"], CleanBoard>,
}>

type RawGameLoop = GameLoop<InitialGameState>
type LastGameState = Run<InitialGameState, Inputs["length"]>
type LastBoardState = LastGameState["Board"]
type LastPieceState = LastGameState["FallingPiece"]
type LastLockedTilesState = LastGameState["LockedTiles"]

type lmao = IsWithinBoundaries<LastPieceState>
type lmao2 = IsOverlapping<LastPieceState, LastLockedTilesState>
type lmao3 = CanMove<LastPieceState, LastLockedTilesState>
type lmao4 = ApplyMoves<LastPieceState, MovesAt<LastGameState>> 
type lmao5 = CheckFilledLines<LastLockedTilesState>
type lmao6 = GetMinAndMaxCoordinates<LastPieceState>
type lmao8 = Rotate<LastPieceState>

type Inputs = MkMove<[
    ["RIGHT","UP", "UP", "UP"], 
]>

type Display = GridToDisplay<LastBoardState>