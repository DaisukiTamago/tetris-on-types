type Coordinate = { x: number; y: number }
type MkCoordinate<T extends Coordinate> = { x: T["x"], y: T["y"] }

type Cell = { value: Colors[keyof Colors] } & Coordinate

type GridRow = Cell[]

type Grid = Cell[]

type a = Div<4, 4>
type MkGrid<GridSize extends number, Acc extends Cell & { index: number } = { value: Colors["BLACK"], x: 0, y: 0, index: 0 }, Result extends Grid = []> = 
    Result["length"] extends GridSize ?
        Result
        : Sum<Acc["index"], 1> extends (infer NextIndex extends number) ? 
            MkGrid<GridSize, { value: Acc["value"], x: 0, y: Div<NextIndex, TotalGridColumns>, index: NextIndex }, [Acc, ...Result]>
            : never

type State = MkGrid<GridSize>

// 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10
// 0  0  1  1  2  2  3  3  4  4  5