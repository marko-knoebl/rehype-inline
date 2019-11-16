const unified = require("unified");

const inline = require("./index.js");

const example1 = {
  type: "root",
  children: [
    {
      type: "element",
      tagName: "div",
      properties: {},
      children: [{ type: "text", value: "a" }]
    },
    {
      type: "element",
      tagName: "link",
      properties: { rel: ["stylesheet"], href: "test_assets/style.css" }
    },
    {
      type: "element",
      tagName: "script",
      properties: { src: "test_assets/script.js" }
    },
    {
      type: "element",
      tagName: "img",
      properties: { src: "test_assets/image.bmp" }
    },
    {
      type: "element",
      tagName: "img",
      properties: { src: "test_assets/vector.svg" }
    },
    {
      type: "element",
      tagName: "link",
      properties: {
        rel: ["import"],
        type: "text/html",
        href: "test_assets/fragment.html"
      }
    },
    {
      type: "element",
      tagName: "link",
      properties: {
        rel: ["import"],
        type: "text/html",
        href: "test_assets/fragment.html"
      }
    }
  ]
};

const pipeline = unified().use(inline);
const pipelineWithSvgElements = unified().use(inline, { svgElements: true });

it("inlines sample assets into an HTML file", () => {
  const example1Copy = JSON.parse(JSON.stringify(example1));
  const result = pipeline.runSync(example1Copy);
  expect(result.children[1].tagName).toEqual("style");
  expect(result.children[1].children[0].type).toEqual("text");
  expect(result.children[2].children).toEqual([
    { type: "text", value: "let a = 1;" }
  ]);
  expect(result.children[3].tagName).toEqual("img");
  expect(result.children[3].properties.src).toMatch(
    "data:image/bmp;base64,Qk2qAA"
  );
  expect(result.children[4].tagName).toEqual("img");
  expect(result.children[4].properties.src).toMatch(
    "data:image/svg+xml;base64,PHN"
  );
  expect(result.children[5].tagName).toEqual("h1");
  expect(result.children[6].value).toEqual("\n");
  expect(result.children[7].tagName).toEqual("p");
  expect(result.children[9].tagName).toEqual("h1");
});

it("inlines img elements with svg sources as svgs", () => {
  const example1Copy = JSON.parse(JSON.stringify(example1));
  const result = pipelineWithSvgElements.runSync(example1Copy);
  expect(result.children[4].tagName).toEqual("svg");
  expect(result.children[4].children[1].tagName).toEqual("rect");
});
