type TotalGridColumns = 5
type TotalGridRows = 4

type GridSize = Multiply<TotalGridColumns, TotalGridRows>

type CleanBoard = MkGrid<GridSize>
type GameOverBoard = MkGrid<GridSize, { value: Colors["RED"], x: 0, y: 0, index: 0 }>

type InitialGameState = MkGameState<{
    Inputs: Inputs
    LockedTiles: []
    FallingPiece: NextTetromino<InitialGameState["currentTick"]>
    currentTick: 0
    Board: RenderCellsOnGrid<InitialGameState["FallingPiece"], CleanBoard>,
    IsGameOver: false
    Score: 0
}>

type UpdatedGameState = Run<InitialGameState, SizeOf<Inputs>>

type Inputs = MkMove<[
    []
]>

type Display = GridToDisplay<UpdatedGameState["Board"]>
