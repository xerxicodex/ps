import {Data, GenerationNum} from './data/interface';

type GenderName = 'M' | 'F' | 'N';
type SideID = 'p1' | 'p2';
type Protocol = 'https' | 'http';
type Facing = 'front' | 'frontf' | 'back' | 'backf';

const PROTOCOL = 'https';
const DOMAIN = 'play.pokemonshowdown.com';
const URL = (options?: {protocol?: Protocol; domain?: string}) => {
  const url = `${options?.protocol ?? PROTOCOL}://${options?.domain ?? DOMAIN}`;
  return url.endsWith('/') ? url.slice(0, -1) : url;
};

const GENS = {
  'gen1rg': 1,
  'gen1rb': 1,
  'gen1': 1,
  'gen2g': 2,
  'gen2s': 2,
  'gen2': 2,
  // 'gen2ani': 2,
  'gen3rs': 3,
  'gen3frlg': 3,
  'gen3': 3,
  'gen3-2': 3,
  // 'gen3ani': 3,
  'gen4dp': 4,
  'gen4dp-2': 4,
  'gen4': 4,
  // 'gen4-2': 4,
  // 'gen4hgss': 4,
  // 'gen4hgss-2': 4,
  'gen5': 5,
  'gen5ani': 5,
  // 'noani': 6,
  'ani': 6,
} as const;

export type GraphicsGen = keyof typeof GENS;

const ANIMATED = {
  // 'gen2ani': 2,
  // 'gen3ani': 3,
  'gen5ani': 'gen5' as GraphicsGen,
  'ani': 'dex' as GraphicsGen,
};

export type AnimatedGraphicsGen = keyof typeof ANIMATED;

const FRAME2 = {
  'gen3-2': 'gen3' as GraphicsGen,
  'gen4dp-2': 'gen4dp' as GraphicsGen,
  // 'gen4-2': 'gen4' as GraphicsGen,
  // 'gen4hgss-2': 'gen4hgss' as GraphicsGen,
};

export type SecondFrameGraphicsGen = keyof typeof FRAME2;

const SOURCES: {[name: string]: GraphicsGen} = {
  'Green': 'gen1rg',
  'Red/Blue': 'gen1rb',
  'Yellow': 'gen1',
  'Gold': 'gen2g',
  'Silver': 'gen2s',
  'Crystal': 'gen2',
  // 'Crystal (2)': 'gen2-2',
  'Ruby/Sapphire': 'gen3rs',
  'FireRed/LeafGreen': 'gen3frlg',
  'Emerald': 'gen3',
  'Emerald (2)': 'gen3-2',
  'Diamond/Pearl': 'gen4dp',
  'Diamond/Pearl (2)': 'gen4dp-2',
  'Platinum': 'gen4',
  // 'Platinum (2)': 'gen4-2':
  // 'HeartGold/SoulSilver': 'gen4hgss':
  // 'HeartGold/SoulSilver (2)': 'gen4hgss-2':
  'Black/White': 'gen5',
  'Black/White (Animated)': 'gen5ani',
  // 'Modern': 'noani',
  'Modern (Animated)': 'ani',
};

export interface PokemonSprite {
  gen: GenerationNum;
  w: number;
  h: number;
  url: string;
  pixelated?: boolean;
}

// Several Pokemon were added in the middle of Gen 4 and thus are not present in gen4dp{,-2}
const NONDP = new Set([
  'giratinaorigin', 'rotomfan', 'rotomfrost', 'rotomheat', 'rotommow', 'rotomwash', 'shayminsky',
]);

export class Sprites {
  SOURCES = SOURCES;
  GENS = GENS;
  ANIMATED = ANIMATED;
  FRAME2 = FRAME2;

  readonly data: Data;

  constructor(data: Data) {
    this.data = data;
  }

  /**
   * Returns information suitable for rendering a named Pokémon sprite based on the options.
   *
   * @param name - name of the Pokémon to retrieve a sprite for
   * @param options - options controlling which sprite is chosen:
   *
   *   - `gen`: the preferred graphics or generation to use, defaults to `'ani'`
   *   - `side`: which side the Pokémon is on. Defaults to `'p2'` which is a front sprite, `'p1'`
   *             will select a back sprite
   *   - `gender`: the gender of the Pokémon, `undefined` by default, only relevant if it set to
   *               `'F'` in Gen 4 or later
   *   - `shiny`: whether or not the Pokémon sprite should be shiny, defaults to `false`
   *   - `protocol`: URL protocol, defaults to `'https'`, but `'http'` is also allowed
   *   - `domain`: the domain to fetch sprites from, defaults to `'play.pokemonshowdown.com`
   *
   * @return {PokemonSprite}
   */
  getPokemon(
    name: string,
    options?: {
      gen?: GraphicsGen | GenerationNum;
      side?: SideID;
      gender?: GenderName;
      shiny?: boolean;
      protocol?: Protocol;
      domain?: string;
    }
  ) {
    const url = `${URL(options)}/sprites`;
    const data = this.data.getPokemon(name);
    if (!data) {
      // If we can't figure out the Pokemon in question we just return a question mark icon
      return {gen: 5, w: 96, h: 96, url: `${url}/gen5/0.png`, pixelated: true};
    }

    const max = typeof options?.gen === 'string'
      ? this.GENS[options.gen] as GenerationNum
      : options?.gen || 8;
    // Regardless of the generation context, we can only go back to the first generation
    // the Pokemon existed in (or BW, because the Smogon Sprite Project guarantees BW sprites).
    const min = Math.min(data.gen, 5) as GenerationNum;
    let gen = Math.max(max, min) as GenerationNum;

    let graphics: GraphicsGen;
    if (!options?.gen ||
      typeof options.gen === 'number' ||
      gen !== this.GENS[options.gen]) {
      graphics = (gen <= 5 ? `gen${gen}` : 'ani') as GraphicsGen;
    } else {
      graphics = options.gen;
    }

    let dir: string = graphics;
    let facing: Facing = 'front';
    if (options?.side === 'p1') {
      dir += '-back';
      facing = 'back';
    }
    if (options?.shiny && gen > 1 && !data.nonshiny) dir += '-shiny';

    // Directory rewrites due to missing sprites
    const rewrite = (d: string, a: GraphicsGen, b: GraphicsGen) =>
      [this.GENS[b], b, `${b}${d.slice(a.length)}`] as [GenerationNum, GraphicsGen, string];

    if (data.spriteid === 'missingno' && gen > 1) {
      [gen, graphics, dir] = rewrite(dir, graphics, 'gen1');
    } else if (dir.startsWith('gen4dp') && NONDP.has(data.id)) {
      [gen, graphics, dir] = rewrite(dir, graphics, 'gen4');
    } else if (facing === 'back' && graphics in this.FRAME2) {
      const frame1 = this.FRAME2[graphics as SecondFrameGraphicsGen];
      [gen, graphics, dir] = rewrite(dir, graphics, frame1);
      dir = `${frame1}${dir.slice(graphics.length)}`;
    } else if (dir.startsWith('gen1rg-back') || dir.startsWith('gen1rb-back')) {
      [gen, graphics, dir] = rewrite(dir, graphics, 'gen1');
    } else if (dir.startsWith('gen2g-back') || dir.startsWith('gen2s-back')) {
      [gen, graphics, dir] = rewrite(dir, graphics, 'gen2');
    } else if (dir.startsWith('gen3rs-back') || dir.startsWith('gen3frlg-back')) {
      [gen, graphics, dir] = rewrite(dir, graphics, 'gen3');
    } else if (dir.startsWith('gen4dp-back')) {
      [gen, graphics, dir] = rewrite(dir, graphics, 'gen4');
    } else if (dir.startsWith('gen3frlg')) {
      // FRLG added new sprites only for Kanto Pokemon, Deoxys and Teddiursa(?!)
      if (!((data.gen === 1 && data.num <= 151) ||
             data.id === 'teddiursa' ||
             data.id.startsWith('deoxys'))) {
        [gen, graphics, dir] = rewrite(dir, graphics, 'gen3');
      }
    } else if (dir === 'ani-back-shiny') {
      // FIXME: temporary weird missing sprite special cases that are hard to elegantly handle
      if (['unown-f', 'unown-p'].includes(data.spriteid) ||
          (options?.gender === 'F' && ['snover', 'buizel'].includes(data.spriteid))) {
        [gen, graphics, dir] = rewrite(dir, graphics, 'gen5');
      }
    }

    const facingf = facing + 'f' as 'frontf' | 'backf';
    if (graphics in this.ANIMATED) {
      const d = graphics === 'gen5ani' ? (data.bw ?? {}) : data;
      if (d[facingf] && options?.gender === 'F') facing = `${facing}f` as Facing;

      if (d[facing] && !data.missing?.includes(dir)) {
        const w = d[facing]!.w ?? 96;
        const h = d[facing]!.h ?? 96;
        const file = facing.endsWith('f') ? `${data.spriteid}-f` : data.spriteid;

        return {gen, w, h, url: `${url}/${dir}/${file}.gif`, pixelated: gen <= 5};
      }

      [gen, graphics, dir] = rewrite(dir, graphics, 'gen5');
    } else if ((data[facingf] && options?.gender === 'F')) {
      facing = `${facing}f` as Facing;
    }

    // Visual gender differences didn't exist for sprites until Gen 4
    const file = (data.gen >= 4 && data[facing] && facing.endsWith('f'))
      ? `${data.spriteid}-f`
      : data.spriteid;

    return {gen, w: 96, h: 96, url: `${url}/${dir}/${file}.png`, pixelated: true};
  }

  /**
   * Returns information suitable for rendering a Pokémon 'dex' sprite based on the options. Unlike
   * `getPokemon`, the Pokémon returned by `getDexPokemon` is based on what a player would see when
   * they inspect a Pokémon in the Pokédex application in their game (ie. static genderless front
   * sprites).
   *
   * @param name - name of the Pokémon to retrieve a dex sprite for
   * @param options - options controlling which dex sprite is chosen:
   *
   *   - `gen`: the preferred graphics or generation to use, defaults to `'dex'`, must be static
   *   - `shiny`: whether or not the Pokémon sprite should be shiny, defaults to `false`
   *   - `protocol`: URL protocol, defaults to `'https'`, but `'http'` is also allowed
   *   - `domain`: the domain to fetch sprites from, defaults to `'play.pokemonshowdown.com`
   *
   * @return {PokemonSprite}
   */
  getDexPokemon(
    name: string,
    options?: {
      gen?: GraphicsGen | 'dex' | GenerationNum;
      shiny?: boolean;
      protocol?: Protocol;
      domain?: string;
    }
  ) {
    let graphics = options?.gen ?? 'dex';
    if (graphics in this.ANIMATED) graphics = this.ANIMATED[graphics as AnimatedGraphicsGen];
    const data = this.data.getPokemon(name);
    if (!data ||
      !data.dex ||
      (graphics !== 'dex' && !(typeof graphics === 'number' && graphics >= 6))) {
      options = {...options};
      if (!options.gen || options.gen === 'dex') options.gen = 'gen5';
      return this.getPokemon(name, options as any);
    }

    const gen = Math.max(data.gen, 6);
    const shiny = options?.shiny ? '-shiny' : '';
    const size = data.gen >= 7 ? 128 : 120;
    const url = `${URL(options)}/sprites/dex${shiny}/${data.spriteid}.png`;

    return {gen, w: size, h: size, url, pixelated: false};
  }

  /**
   * Returns the information required for rendering a sprite for a 'Substitute'.
   *
   * @param options - options controlling which Substitute sprite is chosen:
   *
   *   - `gen`: the preferred graphics or generation to use, defaults to `8`
   *   - `side`: which side the Substitute is on. Defaults to `'p2'` which is a front sprite, `'p1'`
   *             will select a back sprite
   *   - `protocol`: URL protocol, defaults to `'https'`, but `'http'` is also allowed
   *   - `domain`: the domain to fetch sprites from, defaults to `'play.pokemonshowdown.com`
   *
   * @return {PokemonSprite}
   */
  getSubstitute(
    options?: {
      gen?: GraphicsGen | GenerationNum;
      side?: SideID;
      protocol?: Protocol;
      domain?: string;
    }
  ) {
    const url = `${URL(options)}/sprites/substitutes`;
    let dir: string;
    const iw = 0; // TODO innerWidth
    const ih = 0; // TODO innerHeight

    let gen: GraphicsGen | GenerationNum = options?.gen || 8;
    if (typeof gen === 'string') gen = GENS[gen] as GenerationNum;
    if (gen < 3) {
      dir = 'gen1';
    } else if (gen < 4) {
      dir = 'gen3';
    } else if (gen < 5) {
      dir = 'gen4';
    } else {
      gen = 5;
      dir = 'gen5';
    }
    if (options?.side === 'p1') dir += '-back';
    return {gen, w: 96, h: 96, iw, ih, url: `${url}/${dir}/substitute.png`, pixelated: true};
  }

  /**
   * Returns the URL for a particular trainer avatar.
   *
   * @param avatar - the number or string identifier for the trainer avatar
   * @param options - options controlling the URL returned:
   *
   *   - `protocol`: URL protocol, defaults to `'https'`, but `'http'` is also allowed
   *   - `domain`: the domain to fetch sprites from, defaults to `'play.pokemonshowdown.com`
   *
   * @return {string}
   */
  getAvatar(avatar: number | string, options?: {protocol?: Protocol; domain?: string}) {
    avatar = `${avatar}`;
    avatar = this.data.getAvatar(avatar) ?? avatar;
    const url = `${URL(options)}/sprites/trainers`;
    return (avatar.charAt(0) === '#'
      ? `${url}-custom/${avatar.substring(1)}.png`
      : `${url}/${sanitizeName(avatar || 'unknown')}.png`);
  }
}

export class Icons {
  readonly data: Data;

  constructor(data: Data) {
    this.data = data;
  }

  /**
   * Returns information suitable for rendering a named Pokémon icon based on the options.
   *
   * @param name - name of the Pokémon to retrieve icon information for
   * @param options - options controlling which icon is chosen:
   *
   *   - `side`: which side the Pokémon is on. Defaults to `'p2'` which is a right-facing icon,
   *            'p1'` will select a left-facing icon if one exists
   *   - `gender`: the gender of the Pokémon, `undefined` by default, only relevant if it set to
   *               `'F'` in Gen 4 or later and a female icon for the Pokémon exists
   *   - `fainted`: whether or not the Pokémon has fainted
   *   - `protocol`: URL protocol, defaults to `'https'`, but `'http'` is also allowed
   *   - `domain`: the domain to fetch sprites from, defaults to `'play.pokemonshowdown.com`
   */
  getPokemon(
    name: string,
    options?: {
      side?: SideID;
      gender?: GenderName;
      fainted?: boolean;
      protocol?: Protocol;
      domain?: string;
    }
  ) {
    const data = this.data.getPokemon(name);

    let num = data?.num ?? 0;
    if (num < 0 || num > 898) num = 0;
    if (data?.icon) num = data.icon;
    if (options?.gender === 'F') num = data?.iconf ?? num;
    if (options?.side !== 'p2') num = data?.iconl ?? num;

    const top = -Math.floor(num / 12) * 30;
    const left = -(num % 12) * 40;

    const url = `${URL(options)}/sprites/pokemonicons-sheet.png`;
    const css: {[attr: string]: string} = {
      display: 'inline-block',
      width: '40px',
      height: '30px',
      imageRendering: 'pixelated',
      background: `transparent url(${url}) no-repeat scroll ${left}px ${top}px`,
    };
    if (options?.fainted) {
      css.opacity = '0.3';
      css.filter = 'grayscale(100%) brightness(.5)';
    }

    return {style: toStyle(css), url, left, top, css};
  }

  /**
   * Returns information required to display an icon for a particular type of Pokeball.
   *
   * @param name - the name of the Pokeball to retrieve icon information for
   * @param options - options controlling the URL returned:
   *
   *   - `protocol`: URL protocol, defaults to `'https'`, but `'http'` is also allowed
   *   - `domain`: the domain to fetch sprites from, defaults to `'play.pokemonshowdown.com`
   */
  getPokeball(name: string, options?: {protocol?: Protocol; domain?: string}) {
    let left = 0;
    let top = 0;

    const css: {[attr: string]: string} = {
      display: 'inline-block',
      width: '40px',
      height: '30px',
      imageRendering: 'pixelated',
    };

    if (name === 'pokeball') {
      left = 0;
      top = 4;
    } else if (name === 'pokeball-statused') {
      left = -40;
      top = 4;
    } else if (name === 'pokeball-fainted') {
      left = 80;
      top = 4;
      css.opacity = '0.4';
      css.filter = 'contrast(0)';
    } else if (name === 'pokeball-none') {
      left = -80;
      top = 4;
    } else {
      return undefined;
    }
    const url = `${URL(options)}/sprites/pokemonicons-pokeball-sheet.png`;
    css.background = `transparent url(${url}) no-repeat scroll ${left}px ${top}px`;

    return {style: toStyle(css), url, left, top, css};
  }

  /**
   * Returns information required to display an icon for a particular Item.
   *
   * @param name - the name of the Item to retrieve icon information for
   * @param options - options controlling the URL returned:
   *
   *   - `protocol`: URL protocol, defaults to `'https'`, but `'http'` is also allowed
   *   - `domain`: the domain to fetch sprites from, defaults to `'play.pokemonshowdown.com`
   */
  getItem(name: string, options?: {protocol?: Protocol; domain?: string}) {
    const num = this.data.getItem(name)?.spritenum ?? 0;
    const top = -Math.floor(num / 16) * 24;
    const left = -(num % 16) * 24;
    const url = `${URL(options)}/sprites/itemicons-sheet.png`;

    const css: {[attr: string]: number | string} = {
      display: 'inline-block',
      width: '24px',
      height: '24px',
      imageRendering: 'pixelated',
      background: `transparent url(${url}) no-repeat scroll ${left}px ${top}px`,
    };

    return {style: toStyle(css), url, top, left, css};
  }

  /**
   * Returns information required to display an icon for a particular Type.
   *
   * @param name - the name of the Type to retrieve icon information for
   * @param options - options controlling the URL returned:
   *
   *   - `protocol`: URL protocol, defaults to `'https'`, but `'http'` is also allowed
   *   - `domain`: the domain to fetch sprites from, defaults to `'play.pokemonshowdown.com`
   */
  getType(name: string, options?: {protocol?: Protocol; domain?: string}) {
    const type = name === '???'
      ? '%3f%3f%3f'
      : `${name.charAt(0).toUpperCase()}${(name).substr(1).toLowerCase()}`;
    const url = `${URL(options)}/sprites/types/${type}.png`;
    return {url, type, w: 32, h: 14};
  }
}

function sanitizeName(name: any) {
  if (!name) return '';
  return ('' + name)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
    .slice(0, 50);
}

function toStyle(css: {[attr: string]: number | string}) {
  const style = [];
  for (const attr in css) {
    style.push(`${attr === 'imageRendering' ? 'image-rendering' : attr}:${css[attr]}`);
  }
  return `${style.join(';')};`;
}
