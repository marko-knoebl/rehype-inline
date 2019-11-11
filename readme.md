# Rehype-inline

A rehype / unified plugin that inlines assets like CSS, JavaScript and images into rehype trees.

## Installation

```bash
npm install @karuga/rehype-inline
```

## Example

```js
const fs = require("fs");
const unified = require("unified");
const rehypeParse = require("rehype-parse");
const rehypeInline = require("@karuga/rehype-inline");
const rehypeStringify = require("rehype-stringify");

const input = `
  <link
    rel="stylesheet"
    href="node_modules/@karuga/rehype-inline/test_assets/style.css" />
  <script src="node_modules/@karuga/rehype-inline/test_assets/script.js">
  </script>
  <img src="node_modules/@karuga/rehype-inline/test_assets/image.bmp" />
  <img src="node_modules/@karuga/rehype-inline/test_assets/vector.svg" />
`;

const pipeline = unified()
  .use(rehypeParse, { fragment: true })
  .use(rehypeInline)
  .use(rehypeStringify);

const output = pipeline.processSync(input).toString();
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
```

## Options

example:

```js
const pipeline = unified()
  .use(rehypeParse, { fragment: true })
  .use(rehypeInline, { js: true, css: true, images: true, svgElements: false })
  .use(rehypeStringify);
```

available options:

- **js**, **css**, **images**: whether to inline these asset types (default: true)
- **svgElements**: whether to include svgs as `<svg>` elements instead of `<img>` elements (default: false)
