# TODO

## `@xerxicodex/sim`

- Pokémon Showdown's underlying data definitions (eg. `MoveData`) could use a lot of cleanup and
  consolidation (better grouping, naming, etc)
- In an ideal world, `@xerxicodex/sim` could be made to depend on `@xerxicodex/dex`. The main blockers are:
  - `TeamValidator` needs to be able able to handle an `async getLearnsets` API (requires changes
  to Pokémon Showdown to avoid forking more files)
  - the `import` script needs to decompose Pokémon Showdown's 'data' files to write out just the
  handler logic which can be recombined with the data from `@xerxicodex/dex` on demand.

## `@xerxicodex/sets`

- consider rewriting based on
  [Pokémon Showdown](https://github.com/smogon/pokemon-showdown-client/blob/master/src/panel-teamdropdown.tsx)

## `@xerxicodex/img`

- redo API to use better identifiers than `gen2g` (`gen: 2` = `release: 'Crystal'` > `'gen2'`)
- handle full ordered preference array (not just `gen2g`, full array of preferences)
- allow for specifying whether to fall back to non-canonical or not**
- offload ugliness to `smogon/sprites` (embed in `vendor/`?) related to gaps or missing data
  (should be symlinked), have `smogon/sprites` build a mapping file that can be used to
  avoid redundant lookups

## `@xerxicodex/login`

- upkeep example with cookies

## `@xerxicodex/client`

- handle discrepancies with `@xerxicodex/sim` (for `@xerxicodex/epoke` state transforms)
  - change `type`/`addedType` etc handling to match server?

## `@xerxicodex/view`

- demonstration of how to recreate Pokémon Showdown's `AnimatedBattle` hooks on top of
  `@xerxicodex/client` (`BattleSceneStub` equivalent, but use `Partial` instead of null object pattern)
- logic for displaying the Pokémon Showdown protocol *(how should arbitrary HTML be handled? Fully
  escaped? Or embed an HTML sanitizer?)*
