# `@xerxicodex/mods`

![Test Status](https://github.com/pkmn/ps/workflows/Tests/badge.svg)
![License](https://img.shields.io/badge/License-MIT-blue.svg)
[![npm version](https://img.shields.io/npm/v/@xerxicodex/mods.svg)](https://www.npmjs.com/package/@xerxicodex/mods)

An automatically generated extraction of the non-canonical mainstream mods from the
[smogon/pokemon-showdown](https://github.com/smogon/pokemon-showdown) simulator which can be
applied to [`@xerxicodex/sim`](../sim) and [`@xerxicodex/dex`](../dex).

## Installation

```sh
$ npm install @xerxicodex/mods
```

## Usage

This package contains data and logic for several mods:

- `gen1jpn`: A mod on top of Generation 1 which implements Japanese version-specific mechanics
- `gen1stadium`: A mod on top of Generation 1 which implements Pokémon Stadium
- `gen2stadium2`: A mod on top of Generation 2 which implements Pokémon Stadium 2
- `gen4pt`: A mod on top of Generation 4 which contains data from just Diamond, Pearl, and Platinum
- `gen5bw1`: A mod on top of Generation 5 which contains data from just Black & White
- `gen6xy`: A mod on top of Generation 6 which contains data from just X & Y
- `gen7sm`: A mod on top of Generation 7 which contains Pokémon Sun & Moon data (as opposed to Ultra
  Sun and Ultra Moon)
- `gen7letsgo`: A mod on top of Generation 7 which implements Let's Go Pikachu and Let's Go Eevee
- `gen8dlc1`: A mod on top of Generation 8 which contains data from just Pokémon Sword and Shield
   and the Isle of Armor DLC (ie. Generation 8 **without** the data from the Crown Tundra DLC)
- `gen8bdsp`: A mod on top of Generation 8 which implements Brilliant Diamond and Shining Pearl

These mods can be applied to a `Dex` implementation by passing the data as an argument to the `mod`
method. Because of type inconsistencies between `@xerxicodex/sim` and `@xerxicodex/dex`, to typecheck **the
imported mod must be cast to `ModData`** first. This cast should be safe, but unfortunately results
in slightly less ergonomic usage than would be desirable.

```ts
import {Dex, ID, ModData} from '@xerxicodex/dex'; // '@xerxicodex/sim'

const dex = Dex.mod('gen7sm' as ID, await import('@xerxicodex/mods/gen7sm') as ModData);
```

The TypeScript compiler may require special configuration to be able to directly import a
subdirectory of the main `@xerxicodex/mods` package - see the
[`tsconfig.json` documentation](https://www.typescriptlang.org/tsconfig) on
[`baseUrl`](https://www.typescriptlang.org/tsconfig#baseUrl) and
[`paths`](https://www.typescriptlang.org/tsconfig#paths).

```json
{
 "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@xerxicodex/mods/*": ["node_modules/@xerxicodex/mods/build/*"]
    }
  }
}
```

The `ModdedDex` wrapper class around `Dex` exists for typechecking purposes as well - if mod data
contains entirely new fields, `ModdedDex` (initialized with the correct types as parameters) will
allow for presenting a typesafe API to clients (though internally relies on casting, which is not
guaranteed to be safe). There are cleaner ways to implement typesafe mods, but this `ModdedDex`
approach aims to simply acheive parity with the upstream Pokémon Showdown implementation.

```ts
import {Dex, ID, ModData, Ability, AbilityData} from '@xerxicodex/dex'; // '@xerxicodex/sim'
import {ModdexDex} from '@xerxicodex/mods';

const dex = Dex.mod('foo' as ID, {
  Abilities: {
    magicguard: {
      inherit: true,
      foo: 5,
    },
    ...
  },
} as ModData);
const modded = new ModdedDex<Ability & {foo?: number}, AbilityData & {foo?: number}>(dex);

console.log(modded.abilities.get('magicguard').foo);
```

### Browser

The recommended way of using `@xerxicodex/sim` in a web browser is to **configure your bundler**
([Webpack](https://webpack.js.org/), [Rollup](https://rollupjs.org/),
[Parcel](https://parceljs.org/), etc) to minimize it and package it with the rest of your
application.

## License

Substantial amounts of the code in this package have been either derived or generated from portions
of [Pokémon Showdown code](https://github.com/smogon/pokemon-showdown) which are distributed under
the [MIT License](LICENSE).
