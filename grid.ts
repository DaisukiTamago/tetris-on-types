type Coordinate = { x: number; y: number }
type CoordsFromCell<T extends Cell> = { x: T["x"], y: T["y"] }
type Cell = { value: Colors[keyof Colors] } & Coordinate
type GridRow = Cell[]
type Grid = Cell[]

type MkGrid<GridSize extends number, Acc extends Cell & { index: number } = { value: Colors["BLACK"], x: 0, y: 0, index: 0 }, Result extends Grid = []> = 
    Result["length"] extends GridSize ?
        Result 
        : Sum<Acc["index"], 1> extends (infer NextIndex extends number) ?
                Div<NextIndex, TotalGridColumns> extends (infer Row extends number) ?
                    Mod<NextIndex, TotalGridColumns> extends (infer Column extends number) ?
                        MkGrid<GridSize, { value: Acc["value"], x: Column, y: Row, index: NextIndex }, [Acc, ...Result]>
                        : never
                : never
          : never

type RenderCellsOnGrid<Cells extends Cell[], GridState extends Grid> = 
    GridState extends [infer Head extends Cell, ...infer Rest extends Grid] ? 
        Includes<Cells, { x: Head["x"], y: Head["y"] }> extends infer Match extends Cell ? 
            [Match, ...RenderCellsOnGrid<Cells, Rest>] 
            : [Head, ...RenderCellsOnGrid<Cells, Rest>]
        : []

type Includes<List extends unknown[], Target extends unknown> = List extends [infer Head, ...infer Rest] ? 
    Head extends Target ? Head : Includes<Rest, Target> 
    : 'Item not included'

type GetRowAt<GridState extends Grid, Row extends number, Acc extends Grid = []> = 
        GridState extends [infer Head extends Cell, ...infer Rest extends Grid] ? 
            Head["y"] extends Row ? GetRowAt<Rest, Row, [...Acc, Head]> : GetRowAt<Rest, Row, Acc> 
            : Acc