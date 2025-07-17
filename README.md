# @webtaku/h

A small, type-safe utility for creating **HTML strings** with a concise API in TypeScript.

## Features

* Type-safe `Selector` syntax (`div#id.class`)
* Create **HTML strings**
* Supports attributes and inline styles
* Simple and composable API

## Installation

```bash
yarn add @webtaku/h
```

or

```bash
npm install @webtaku/h
```

## API

### `h<S extends Selector>(selector?: S, ...children): string`

Creates an **HTML string**.

#### Parameters

* `selector` (optional): A string selector such as `div`, `span#my-id`, `p.my-class`, `section#id.class`. Defaults to `div`.
* `...children`:

  * `HTMLElement` — converted to `outerHTML`
  * `string` — added as HTML text
  * `ElementProps<S>` — sets attributes and styles

#### Returns

An HTML string.

## Example

```ts
import { h } from '@webtaku/h';

const markup = h('a.link#home', 
  'Home',
  { href: '/', style: { textDecoration: 'none' } }
);

console.log(markup);
// <a id="home" class="link" href="/" style="textDecoration: none">Home</a>
```

## Selector Syntax

| Selector String       | Output                             |
| --------------------- | ---------------------------------- |
| `''`                  | `<div>`                            |
| `'span'`              | `<span>`                           |
| `'div#app'`           | `<div id="app">`                   |
| `'p.text'`            | `<p class="text">`                 |
| `'section#main.hero'` | `<section id="main" class="hero">` |

## ElementProps

An object that specifies attributes and styles for the element.

```ts
{
  id?: string;
  class?: string;
  style?: Partial<CSSStyleDeclaration>;
  [prop: string]: any;
}
```

## Example

```ts
console.log(
  h('div#container.box', 
    h('h1', 'Hello World'),
    h('p', 'This is a paragraph.', { style: { color: 'blue' } })
  )
);
// <div id="container" class="box"><h1>Hello World</h1><p style="color: blue">This is a paragraph.</p></div>
```

## License

MIT OR Apache-2.0

## Contributing

Contributions are welcome. Feel free to open issues or submit pull requests to improve the library.
