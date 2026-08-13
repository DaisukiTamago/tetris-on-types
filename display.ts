type GridToRows<Board extends Grid, Rows extends unknown[] = [], Result extends unknown[] = [], NumberOfColumns extends number = TotalGridColumns> =
    Board extends [infer Head, ...infer Rest] ?
        Rows extends [infer FirstRow extends unknown[], ...infer RestRows] ?
            FirstRow["length"] extends NumberOfColumns ?
                GridToRows<Board, RestRows, [...Result, FirstRow], NumberOfColumns> : GridToRows<Rest, [[...FirstRow, Head], ...RestRows], Result, NumberOfColumns>
                : GridToRows<Rest, [[Head]], Result, NumberOfColumns>
                :
                Rows extends [infer FirstRow extends unknown[], ...infer RestRows] ?
            FirstRow["length"] extends NumberOfColumns ? [...Result, FirstRow] : never
    : never

type ListToString<List = []> = List extends [infer X extends string, ...infer Xs] ? `${X}${ListToString<Xs>}` : ""

type RowsToDisplay<Rows extends GridRows> = {
    [Row in keyof Rows as Row extends `${number}` ? Row : never]: ListToString<Rows[Row]>
}

type DrawAtPosition<Board extends GridRows, Target extends { x: string, y: string }, Tile = Colors["BLUE"]> = {
  [Row in keyof Board]: Row extends `${number}`
    ? Board[Row] extends [...infer Cells]
      ? {
          [Column in keyof Cells]: { x: Column & string; y: Row } extends Target 
            ? Tile 
            : Cells[Column];
        }
      : never
    : Board[Row];
};

type DrawAtPositions<Board extends GridRows, Target extends { x: string, y: string }, Tile = Colors["BLUE"]> = 
  Board extends [infer Row, ...infer Rest] ? 
    []
    : []

type DrawAtPositionsHelper<Board extends Grid, Target extends { x: string, y: string }, Tile = Colors["BLUE"]> = 
  Board extends [infer Cell, ...infer Rest] ? 
    Cell extends Target ? [Tile] : []
    : []