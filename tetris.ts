type TotalGridColumns = 5
type TotalGridRows = 7

type GridSize = Multiply<TotalGridColumns, TotalGridRows>
type CleanBoard = MkGrid<GridSize>

type InitialGameState = {
    Board: CleanBoard
    FallingPiece: TetrominoToCoordinates<Tetrominoes["O"]>
    LockedTiles: []
}

type LastGameState = Run<InitialGameState, 19>

type LastBoardState = LastGameState["Board"]
type LastPieceState = LastGameState["FallingPiece"]
type LastLockedTilesState = LastGameState["LockedTiles"]

type lmao = IsWithinBoundaries<LastPieceState>
type lmao2 = IsOverlapping<LastPieceState, LastLockedTilesState>
type lmao3 = CanMove<LastPieceState, LastLockedTilesState>

type Display = GridToDisplay<LastBoardState>