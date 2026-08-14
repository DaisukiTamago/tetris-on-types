type GridToString<T extends Grid> = T extends [infer X extends Cell, ...infer Xs extends Grid] ? `${X["value"]}${GridToString<Xs>}` : ""

type GridToDisplay<GridState extends Grid> = {
    [Index in keyof GridState as Index extends `${number}` ? `${GridState[Index]["y"]}` : never]: Index extends `${number}` ? 
    GridToString<GetRowAt<GridState, GridState[Index]["y"]>> : never
}