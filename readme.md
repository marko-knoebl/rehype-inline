# Rehype-inline

A rehype / unified plugin that inlines assets like CSS, JavaScript and images into rehype trees.

## Example

```js
const fs = require("fs");
const unified = require("unified");
const rehypeParse = require("rehype-parse");
const rehypeStringify = require("rehype-stringify");
const rehypeInline = require("./inline.js");

const input = `
  <link rel="stylesheet" href="test_assets/style.css" />
  <script src="test_assets/script.js"></script>
  <img src="test_assets/image.bmp" />
  <img src="test_assets/vector.svg" />
`;

const pipeline = unified()
  .use(rehypeParse, { fragment: true })
  .use(rehypeInline)
  .use(rehypeStringify);

pipeline
  .process(input)
  .then(result => fs.writeFileSync("demo_output.html", result.toString()))
  .catch(console.log);
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
<svg
  xmlns="http://www.w3.org/2000/svg"
  version="1.1"
  width="100"
  height="50"
  viewBox="-50 0 100 50"
>
  <rect x="10" y="10" width="20" height="20" fill="darkgrey"></rect>
</svg>
```
