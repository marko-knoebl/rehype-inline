const unified = require("unified");

const inline = require("./inline.js");

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
      properties: { rel: "stylesheet", href: "test_assets/test_stylesheet.css" }
    },
    {
      type: "element",
      tagName: "script",
      properties: { src: "test_assets/test_script.js" }
    },
    {
      type: "element",
      tagName: "img",
      properties: { src: "test_assets/test_image.bmp" }
    },
    {
      type: "element",
      tagName: "img",
      properties: { src: "test_assets/test_svg.svg" }
    }
  ]
};

const pipeline = unified().use(inline);

it("inlines sample assets into an HTML file", done => {
  pipeline.run(example1).then(result => {
    expect(result.children[1].tagName).toEqual("style");
    expect(result.children[2].children).toEqual([
      { type: "text", value: "let a = 1;" }
    ]);
    expect(result.children[3].tagName).toEqual("img");
    expect(result.children[3].properties.src).toMatch(
      "data:image/bmp;base64,Qk2qAA"
    );
    expect(result.children[4].tagName).toEqual("img");
    expect(result.children[4].properties.src).toMatch(
      "data:image/svg;base64,PHN2"
    );
    done();
  });
});
