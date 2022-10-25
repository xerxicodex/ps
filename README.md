<p align="center">
  <img alt="pkmn/ps" width="192" height="192" src="https://pkmn.cc/pokeball.png" />
  <br />
  <br />
  <a href="https://github.com/pkmn/ps/actions/workflows/test.yml">
    <img alt="Test Status" src="https://github.com/pkmn/ps/workflows/Tests/badge.svg" />
  </a>
  <a href="https://github.com/pkmn/ps/blob/master/LICENSE">
    <img alt="License" src="https://img.shields.io/badge/License-MIT-blue.svg" />
  </a>
</p>
<hr />

> [Pokémon Showdown](https://pokemonshowdown.com), [modularized into
> packages](https://pkmn.cc/modular-ps).

This is the top level of [`@pkmn`](https://pkmn.cc/@xerxicodex/)'s Pokémon Showdown components.

- [`@xerxicodex/sim`](sim): an automatically generated extraction of just the simulator portion of
  [smogon/pokemon-showdown](https://github.com/smogon/pokemon-showdown)
- [`@xerxicodex/dex`](dex): a unification of
  [smogon/pokemon-showdown](https://github.com/smogon/pokemon-showdown)'s and
  [smogon/pokemon-showdown-client](https://github.com/smogon/pokemon-showdown-client)'s data layers
- [`@xerxicodex/data`](data): a higher level data API wrapper compatible with [`@xerxicodex/sim`](sim) and
  [`@xerxicodex/dex`](dex)
- [`@xerxicodex/mods`](mods): support for non-standard modifications to [`@xerxicodex/sim`](sim) and
  [`@xerxicodex/dex`](dex)
- [`@xerxicodex/sets`](sets): importing and exporting logic for Pokémon Showdown's set specification
- [`@xerxicodex/types`](types): TypeScript definitions for types common to Pokémon projects
- [`@xerxicodex/protocol`](protocol): Parsing logic for Pokémon Showdown's
  [PROTOCOL](https://github.com/smogon/pokemon-showdown/blob/master/PROTOCOL.md) and
  [SIM-PROTOCOL](https://github.com/smogon/pokemon-showdown/blob/master/sim/SIM-PROTOCOL.md)
- [`@xerxicodex/client`](client): a fork of
  [smogon/pokemon-showdown-client](https://github.com/smogon/pokemon-showdown-client)'s battle
  engine, built on top of [`@xerxicodex/protocol`](protocol)
- [`@xerxicodex/view`](view): a library for building Pokémon Showdown client UIs
- [`@xerxicodex/img`](img): logic for displaying [Pokémon Showdown's sprite/icon
  resources](https://github.com/smogon/sprites)
- [`@xerxicodex/login`](login): logic for authenticating with Pokémon Showdown
- [`@xerxicodex/randoms`](randoms): random team generation logic for Pokémon Showdown's Random Battle
  formats, for use with [`@xerxicodex/sim`](sim)
- [`@xerxicodex/streams`](streams): an automatically generated extraction of Pokémon Showdown's streams
  library

Everything in this repository is distributed under the terms of the [MIT License](LICENSE). For
some packages, substantial amounts of the code have been either derived or generated from the
portions of Pokémon Showdown's [server](https://github.com/smogon/pokemon-showdown) and
[client](https://github.com/smogon/pokemon-showdown-client) codebases  which are also distributed
under the [MIT License](https://github.com/smogon/pokemon-showdown/blob/master/LICENSE).
