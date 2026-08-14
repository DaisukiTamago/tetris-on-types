type TotalGridColumns = 5
type TotalGridRows = 5

type GridSize = Multiply<TotalGridColumns, TotalGridRows>

type InitialGameState = {
    CurrentPiece: TetrominoToCoordinates<Tetrominoes["L"]>
    Board: MkGrid<GridSize>
}

type a = WithGravity<InitialGameState["Board"]>
type GameState1 = GameLoop<InitialGameState>
type GameState2 = GameLoop<GameState1>
type GameState3 = GameLoop<GameState2>
type GameState4 = GameLoop<GameState3>

type Display = GridToDisplay<GameState3["Board"]>