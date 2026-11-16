# @kaktovik-numerals/core

Render any number as [Kaktovik numerals](https://en.wikipedia.org/wiki/Kaktovik_numerals) in SVG. No dependencies; works in Node and the browser.

<img src="https://raw.githubusercontent.com/karlnorling/kaktovik-numerals/main/examples/1993.svg" alt="1993" height="80"> <img src="https://raw.githubusercontent.com/karlnorling/kaktovik-numerals/main/examples/19.svg" alt="19" height="80"> <img src="https://raw.githubusercontent.com/karlnorling/kaktovik-numerals/main/examples/rainbow.svg" alt="1234567 in rainbow colours" height="80">

```sh
npm install @kaktovik-numerals/core
```

```js
import { toSvg } from '@kaktovik-numerals/core';

document.body.innerHTML = toSvg(1993, { size: 200 });

// Colours and backgrounds take CSS gradients too.
toSvg('1234567', {
  color: 'linear-gradient(to right, #e03131, #f76707, #fab005, #40c057, #228be6, #7048e8, #be4bdb)',
});
```

Places count in twenties, a dot starts the fraction, and negatives get a minus sign. For PNG, JPEG or WebP, use [`@kaktovik-numerals/raster`](https://www.npmjs.com/package/@kaktovik-numerals/raster).

See the [docs and playground](https://karlnorling.github.io/kaktovik-numerals/) for every option and how numbers are drawn.

## License

MIT
