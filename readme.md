# Rehype-inline

A rehype / unified plugin that inlines assets like CSS, JavaScript, images and HTML / markdown imports into rehype trees.

## Installation

```bash
npm install rehype-inline
```

## Example

```js
import fs from "fs";
import { unified } from "unified";
import rehypeParse from "rehype-parse";
import rehypeInline from "rehype-inline";
import rehypeStringify from "rehype-stringify";

const input = `
  <link
    rel="stylesheet"
    href="node_modules/rehype-inline/test_assets/style.css" />
  <script src="node_modules/rehype-inline/test_assets/script.js"></script>
  <img src="node_modules/rehype-inline/test_assets/image.bmp" />
  <img src="node_modules/rehype-inline/test_assets/vector.svg" />
  <link
    rel="import"
    href="node_modules/rehype-inline/test_assets/fragment.html" />
  <link
    rel="import"
    href="node_modules/rehype-inline/test_assets/fragment.md"
    type="text/markdown" />
`;

const processor = unified()
  .use(rehypeParse, { fragment: true })
  .use(rehypeInline)
  .use(rehypeStringify);

const output = processor.processSync(input).toString();
fs.writeFileSync("demo_output.html", output);
```

This will create an unformatted HTML file with this structure:

```html
<style>
  * {
    box-sizing: border-box;
  }
</style>
<script>
  let a = 1;
</script>
<img src="data:image/bmp;base64,Qk2qAAAA..." />
<img src="data:image/svg+xml;base64,PHN..." />
<h1>fragment heading</h1>
<p>fragment paragraph</p>
<h1>fragment heading</h1>
<p>fragment paragraph</p>
```

## Options

example:

```js
const processor = unified()
  .use(rehypeParse, { fragment: true })
  .use(rehypeInline, {
    js: true,
    css: true,
    images: true,
    imports: true,
    svgElements: false,
  })
  .use(rehypeStringify);
```

available options:

- **js**, **css**, **images**, **imports**: whether to inline these asset types (default: true)
- **svgElements**: whether to include svgs as `<svg>` elements instead of `<img>` elements (default: false)
