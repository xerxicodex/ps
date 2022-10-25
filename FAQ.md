# FAQ

## Is this project actively being maintained?

Yes.

You should be able to judge the activity level of this project by looking at how recently a
[package has been released](https://www.npmjs.com/package/@xerxicodex/sim), the
[commit activity on this repository](https://github.com/pkmn/ps/commits/master) and the activity
from the [pkmn organization in general](https://github.com/pkmn). If at any point this package
is no longer being maintained the documentation will be updated to reflect that (and NPM will
warn about it) and the repository itself will be [archived](https://github.com/pkmn-archive).

## What is the release schedule? How far out of sync will these packages be with `smogon/pokemon-showdown`?

The release schedule for each package depends on when Pokémon Showdown updates a particular part of
its codebase and whether a sufficient quantity and quality of changes have landed to justify the
overhead of a release. If there are large breaking changes in `smogon/pokemon-showdown` or
`smogon/pokemon-showdown-client` there may be some increased latency before a release.

`pkmn/ps`'s [SLO](https://en.wikipedia.org/wiki/Service-level_objective) is to update at *worst*
once a month, but will aim to release approximately weekly. Pokémon Showdown often runs on the
bleeding edge -  being able to pick a commit from a larger range to cut a release from ends up
resulting in a more stable package to build off of. If your project has a particular need for a
one-off import and release to be cut to capture specific functionality or data, please open an issue
or or reach out on [Discord](https://pkmn.cc/dev) to request one.

## How do I use `X`?

Each released package should contain:

- documentation which includes information on installation, usage, and illustrative examples
- unit tests which provide further examples of intended use

If a package does not contain these things it is possible that it is only intended for internal or
advanced usage and you are perhaps depending on it erroneously. There are
[integration tests](https://github.com/pkmn/ps/blob/master/integration) which consist of very
comprehensive worked examples integrating multiple packages at once. Furthermore, other projects
from the [pkmn organization in general](https://github.com/pkmn) demonstrate non-trivial
usecases for the packages in this repository.

## Why is there no package for `X`?

Certain packages are still a work in progress and have not been released yet. In other cases, the
work involved to modularize and release a specific package has been deemed to not be worthwhile.

## How does versioning work? Is package `X` stable?

`@pkmn` packages are not published at all if they are not expected to be in a useful and usable
state. All packages follow [semantic versioning](https://semver.org/), though many packages have
not yet reached the 1.0.0 mark. After packages have reached 1.0.0, all changes resulting minor or
major version bumps will be documented in a `CHANGELOG.md` file in the directory for the package.

The following packages are stable and only depend on other stable packages. These packages have
reached 1.0.0 versions and changes are mostly motivated by underlying changes in Pokémon Showdown:

- [`@xerxicodex/types`](types)
- [`@xerxicodex/sets`](sets)

The following packages are close to being considered stable - their APIs are very unlikely to change
but they still require some bake time before reaching maturity:

- [`@xerxicodex/login`](login)

The following packages are all versioned together - a change to any one of them will result in the
version being bumped for all of them. All except `@xerxicodex/data` rely directly on `import`-ed Pokémon
Showdown code/logic, and keeping the versions in lockstep is useful for being able to deduce
compatibility at a glance. Most of the APIs are stable, with `@xerxicodex/randoms` being the most stable
API though having the most internal volatility. `@xerxicodex/data`'s API has the most flexibility at this
point, but together these packages are relatively close to 1.0.0 status:

- [`@xerxicodex/sim`](sim)
- [`@xerxicodex/mods`](mods)
- [`@xerxicodex/randoms`](randoms)
- [`@xerxicodex/dex-types`](dex/types)
- [`@xerxicodex/dex`](dex)
- [`@xerxicodex/data`](data)

The following packages are in the most flux - `@xerxicodex/protocol` is relatively stable, but
`@xerxicodex/client` is undergoing heavy development to ensure it fits in well with other
[`@pkmn`](https://pkmn.cc/@xerxicodex/) projects and its API is actively evolving, possibly requiring
changes from `@xerxicodex/protocol` in the process. `@xerxicodex/view` depends heavily on `@xerxicodex/client` and
also will likely have numerous additional classes and helpers added to it before becoming stable.
`@xerxicodex/img`'s status depends heavily on the ongoing
[`smogon/sprites`](https://github.com/smogon/sprites) initiative.

- [`@xerxicodex/protocol`](protocol)
- [`@xerxicodex/client`](client)
- [`@xerxicodex/view`](view)
- [`@xerxicodex/img`](img)

## Should I be depending on `@xerxicodex/types` and `@xerxicodex/dex-types`?

These packages exist primarily for internal purposes - **most consumers should not be depending
directly on these packages**. [`@xerxicodex/data`](data), [`@xerxicodex/dex`](dex), and [`@xerxicodex/sim`](sim)
re-export all of these types (though `@xerxicodex/sim`'s are weaker due to practical considerations) -
simply importing from these packages is the intended usage.

`typeof Dex` is the recommended way to denote the type of the `Dex` object from `@xerxicodex/dex` and
`@xerxicodex/sim`, as once you have a `Dex` implementation chosen the actual object's type is what is
relevant. If you have reasons to make your code data-layer agnostic, `@xerxicodex/dex-types` then becomes
relevant, though you should probably just use `@xerxicodex/data` and let it handle abstracing over `Dex`.

## When should I use a package in this repository as opposed to vendoring `smogon/pokemon-showdown`?

There are several reasons as to why you may wish to use a package in this repository:

- your project wants to depend on logic from `smogon/pokemon-showdown-client`
- you are writing your project in TypeScript and are unable to get a vendored version of
  `smogon/pokemon-showdown` to typecheck
- you would rather not deal with having to figure out where a safe place to cut a release at would
  be
- your project needs to run in the browser or is concerned about code size

You should consider **not** using a package in this repository and instead vendoring
`smogon/pokemon-showdown` (eg. as a
[Git submodule](https://git-scm.com/book/en/v2/Git-Tools-Submodules)) if none of the above applies
and you need to be on the bleeding edge (though note that several projects in this repository add
functionality above and beyond what is offered by `smogon/pokemon-showdown` or
`smogon/pokemon-showdown-client`).

## Would it not make more sense for `smogon/pokemon-showdown` to release its own packages?

Yes.

However, there is a non-trivial maintenance and operational burden involved in creating and
continuing to release a cohesive package suite and Pokémon Showdown currently prefers to dedicate
its engineering resources in other ways.

## What about [`pokemon-showdown`](https://www.npmjs.com/package/pokemon-showdown)?

This faces most of the same problems as vendoring `smogon/pokemon-showdown` except has the added
"benefit" of being out of date. Good luck.

## I still have a question

Please feel free to open a 'Question' issue on GitHub or to reach out on
[Discord](https://pkmn.cc/dev). :)
