<p align="center">
  <img alt="nxpkmn/ps" width="192" height="192" src="https://pkmn.cc/pokeball.png" />
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

This is the top level of [`@nxpkmn`](https://pkmn.cc/@nxpkmn/)'s Pokémon Showdown components.

- [`@nxpkmn/sim`](sim): an automatically generated extraction of just the simulator portion of
  [smogon/pokemon-showdown](https://github.com/smogon/pokemon-showdown)
- [`@nxpkmn/dex`](dex): a unification of
  [smogon/pokemon-showdown](https://github.com/smogon/pokemon-showdown)'s and
  [smogon/pokemon-showdown-client](https://github.com/smogon/pokemon-showdown-client)'s data layers
- [`@nxpkmn/data`](data): a higher level data API wrapper compatible with [`@nxpkmn/sim`](sim) and
  [`@nxpkmn/dex`](dex)
- [`@nxpkmn/mods`](mods): support for non-standard modifications to [`@nxpkmn/sim`](sim) and
  [`@nxpkmn/dex`](dex)
- [`@nxpkmn/sets`](sets): importing and exporting logic for Pokémon Showdown's set specification
- [`@nxpkmn/types`](types): TypeScript definitions for types common to Pokémon projects
- [`@nxpkmn/protocol`](protocol): Parsing logic for Pokémon Showdown's
  [PROTOCOL](https://github.com/smogon/pokemon-showdown/blob/master/PROTOCOL.md) and
  [SIM-PROTOCOL](https://github.com/smogon/pokemon-showdown/blob/master/sim/SIM-PROTOCOL.md)
- [`@nxpkmn/client`](client): a fork of
  [smogon/pokemon-showdown-client](https://github.com/smogon/pokemon-showdown-client)'s battle
  engine, built on top of [`@nxpkmn/protocol`](protocol)
- [`@nxpkmn/view`](view): a library for building Pokémon Showdown client UIs
- [`@nxpkmn/img`](img): logic for displaying [Pokémon Showdown's sprite/icon
  resources](https://github.com/smogon/sprites)
- [`@nxpkmn/login`](login): logic for authenticating with Pokémon Showdown
- [`@nxpkmn/randoms`](randoms): random team generation logic for Pokémon Showdown's Random Battle
  formats, for use with [`@nxpkmn/sim`](sim)
- [`@nxpkmn/streams`](streams): an automatically generated extraction of Pokémon Showdown's streams
  library

Everything in this repository is distributed under the terms of the [MIT License](LICENSE). For
some packages, substantial amounts of the code have been either derived or generated from the
portions of Pokémon Showdown's [server](https://github.com/smogon/pokemon-showdown) and
[client](https://github.com/smogon/pokemon-showdown-client) codebases  which are also distributed
under the [MIT License](https://github.com/smogon/pokemon-showdown/blob/master/LICENSE).
