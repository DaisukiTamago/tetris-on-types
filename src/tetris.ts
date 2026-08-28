type Inputs = MkMove<[["RIGHT"], ["DOWN"], ["UP"], []]>

type Game = Tetris<Inputs>
type Display = DisplayOf<Game>
type Score = Game["Score"]
