type MkGameState<T extends GameState> = T
type GameState = {
    Board: Grid
    CurrentPiece: Cell[]
}

type WithGravity<GridState extends Grid> = GridState extends [infer Head extends Cell, ...infer Rest extends Grid] ?
    [{ value: Head["value"], x: Head["x"], y: Sum<Head["y"], 1> }, ...WithGravity<Rest>]
    : []

type GameLoop<State extends GameState> = WithGravity<State["CurrentPiece"]> extends (infer UpdatedPiece extends Cell[]) ? 
    MkGameState<{ CurrentPiece: UpdatedPiece, Board: RenderCellsOnGrid<UpdatedPiece, MkGrid<GridSize>> }>
    : never