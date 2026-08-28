# Type-Level Tetris

Tetris implemented entirely with TypeScript's type system.

This project demonstrates that TypeScript's type system is
[Turing complete](https://github.com/microsoft/TypeScript/issues/14833)
by evaluating game state, movement, collision, gravity, rotation, line
clearing, scoring, and game-over conditions at compile time.

## Demo

The interactive player lives in the blog repository. This repository contains
the type-level game source that the player compiles.

## Quick Start

```sh
bun install
bun run typecheck
```

No JavaScript is emitted. Type-checking is the execution step.

## How It Works

The game is represented as type-level data:

- `src/parameters.ts`: board dimensions for the current simulation
- `src/math.ts`: arithmetic using tuple types
- `src/constants.ts`: pieces, colors, and piece generation
- `src/helpers.ts`: list operations and mirroring
- `src/grid.ts`: cells, grids, coordinates, and rendering
- `src/game.ts`: movement, collision, gravity, line clearing, and scoring
- `src/display.ts`: converts the board into display rows
- `src/tetris.ts`: example game configuration and initial state

The source files are global type-level fragments and are evaluated together as
one TypeScript program.

## How to Play

The API is a collection of type aliases. To simulate a game, define an input
timeline where each nested array contains the moves attempted during one tick.
`Tetris` creates the default initial state and evaluates it for the length of
the timeline:

```ts
type Inputs = MkMove<[
    ["RIGHT"],
    ["RIGHT"],
    ["DOWN"],
    ["UP"],
    [],
]>

type Game = Tetris<Inputs>
type Display = DisplayOf<Game>
type Score = Game["Score"]
```

Open `Display`, `Score`, or any other property in an editor with TypeScript
support to inspect the computed result. The lower-level `Run` and
`DefaultInitialGameState` aliases remain available when a custom initial state
is useful.

`DOWN` attempts a one-cell move, and invalid moves are ignored. Gravity is
applied every fourth tick. Board dimensions are grouped in the global
`Config` object in `src/parameters.ts`. Larger boards or longer
timelines can be expensive for the compiler, and the project currently targets
TypeScript 6.

## Implementation Quirks

This is not intended to reproduce one particular commercial Tetris release.
It borrows the basic falling-block rules while deliberately taking shortcuts
that keep the type-level implementation understandable and compilable.

| Feature | This project | Early Electronika 60 Tetris | Modern Guideline Tetris |
| --- | --- | --- | --- |
| Playfield | Small example board in `src/tetris.ts`; host dimensions are configurable | 10 x 20 | 10 x 20 plus a hidden buffer zone |
| Piece set | Seven tetromino shapes | Seven tetromino shapes | Seven tetromino shapes |
| Piece sequence | Deterministic `tick % 7` selection | Early random selection with anti-repeat protection | Shuffled 7-bag randomizer |
| Rotation | Direct bounding-box transformation; `UP` only | Original rotation system | SRS with four states and wall/floor kicks |
| Next preview | Not implemented in the type-level source | One optional preview | Queue of one or more pieces |
| Hold | Not implemented | Not available | Standard feature |
| Drop controls | `DOWN` attempts one cell and advances a tick | Hard drop available | Soft drop and hard drop |
| Timing | Gravity every four ticks | Level-based gravity curve | Gravity curve, entry delay, and lock delay |
| Scoring | One point per cleared line | Points awarded for dropping pieces | Line-clear, combo, back-to-back, T-spin, and drop scoring |
| Levels | Not implemented | Present | Standard feature |
| Advanced mechanics | None | No modern hold, SRS, or combo systems | Ghost piece, combos, back-to-back, T-spins, perfect clears, and garbage |

For reference:

- [Original Tetris on the Electronika 60](https://tetris.wiki/Tetris_%28Electronika_60%29)
- [Tetris Guideline](https://tetris.wiki/Tetris_Guideline)
- [Super Rotation System](https://tetris.wiki/Super_Rotation_System)
- [Random Generator / 7-bag](https://tetris.wiki/Random_Generator)
- [Tetris scoring systems](https://tetris.wiki/Scoring)

## License

This project is licensed under the MIT License. See [LICENSE](./LICENSE).
