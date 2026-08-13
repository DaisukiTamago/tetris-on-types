type TotalGridColumns = 4
type TotalGridRows = 4

type GridSize = Multiply<TotalGridColumns, TotalGridRows>

type GameState = {
    Board: TupleOf<GridSize>  
}

type Display = RowsToDisplay<RowsState>