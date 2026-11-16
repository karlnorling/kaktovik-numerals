# @kaktovik-numerals/cli

Draw any number as [Kaktovik numerals](https://en.wikipedia.org/wiki/Kaktovik_numerals) from the command line: SVG, PNG, JPEG or WebP.

```sh
npx @kaktovik-numerals/cli 1993 > 1993.svg
npx @kaktovik-numerals/cli 0.5 -o half.webp --size 200
npx @kaktovik-numerals/cli -42 -o minus.png
```

Installed globally with `npm install -g @kaktovik-numerals/cli`, the command is `kaktovik`.

```
Usage: kaktovik <number> [options]

Draws a number as Kaktovik numerals. Prints SVG to stdout unless --output is given.

Options:
  -o, --output <file>      Write to a .svg, .png, .jpg, .jpeg or .webp file
  -s, --size <px>          Image height in pixels (default 100)
  -c, --color <color>      Colour or CSS gradient (default currentColor for SVG,
                           black for images)
  -b, --background <color> Background colour or CSS gradient (default transparent,
                           white for JPEG)
  -g, --gap <n>            Space between places in viewBox units (default 10)
  -q, --quality <1-100>    JPEG and WebP quality
  -h, --help               Show this help
  -v, --version            Show the version

Examples:
  kaktovik 1993 > 1993.svg
  kaktovik 0.5 -o half.webp --size 200
  kaktovik -42 -o minus.png
  kaktovik 1993 -o 1993.png -c 'linear-gradient(to right, red, blue)'
```

## License

MIT
