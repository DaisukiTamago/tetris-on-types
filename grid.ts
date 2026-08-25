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

type Filter<List extends unknown[], Condition extends unknown, Result extends unknown[] = []> = List extends [infer Head, ...infer Rest] ? 
    Head extends Condition ? Filter<Rest, Condition, [Head, ...Result]> : Filter<Rest, Condition, [...Result]> 
    : Result

type FilterOut<List extends unknown[], Condition extends unknown, Result extends unknown[] = []> = List extends [infer Head, ...infer Rest] ? 
    Head extends Condition ? FilterOut<Rest, Condition, [...Result]> : FilterOut<Rest, Condition, [Head, ...Result]> 
    : Result

type Reverse<List extends unknown, Result extends unknown[] = []> = 
    List extends string ?
        List extends `${infer Head}${infer Rest}` ? 
            Reverse<Rest, [Head, ...Result]> : Join<Result>
        : List extends [infer Head, ...infer Rest] ? 
            Reverse<Rest, [Head, ...Result]> : Result

type Join<List extends unknown[], Result extends string = ""> = 
    List extends [infer Head extends string, ...infer Rest] ? Join<Rest, `${Result}${Head}`> : Result

type Mirror<S extends string> = S extends `${infer A extends string}\n${infer B extends string}`
    ? Reverse<`${B}\n${A}`> : S

type GetMinAndMaxCoordinates<Tiles extends Cell[], Result extends { min: Coordinate, max: Coordinate } = { min: Tiles[0], max: Tiles[0] }> = 
    Tiles extends [infer Head extends Cell, ...infer Rest extends Cell[]] ?
        IsGreaterThanOrEqual<Head["x"], Result["max"]["x"]> extends infer IsNewMaxX extends boolean ?
            IsGreaterThanOrEqual<Head["y"], Result["max"]["y"]> extends infer IsNewMaxY extends boolean ?
                IsGreaterThanOrEqual<Result["min"]["x"], Head["x"]> extends infer IsNewMinX extends boolean ?
                    IsGreaterThanOrEqual<Result["min"]["y"], Head["y"]> extends infer IsNewMinY extends boolean ?
                        GetMinAndMaxCoordinates<Rest, {
                            min: { 
                                x: IsNewMinX extends true ? Head["x"] : Result["min"]["x"], 
                                y: IsNewMinY extends true ? Head["y"] : Result["min"]["y"], 
                            }
                            max: { 
                                x: IsNewMaxX extends true ? Head["x"] : Result["max"]["x"], 
                                y: IsNewMaxY extends true ? Head["y"] : Result["max"]["y"], 
                            }
                        }>
                    : never
                : never
            : never 
        : never
    : Result
 
type GetRowAt<GridState extends Grid, Row extends number, Acc extends Grid = []> = 
        GridState extends [infer Head extends Cell, ...infer Rest extends Grid] ? 
            Head["y"] extends Row ? GetRowAt<Rest, Row, [...Acc, Head]> : GetRowAt<Rest, Row, Acc> 
            : Acc