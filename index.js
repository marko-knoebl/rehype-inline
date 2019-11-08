const fs = require("fs");

const unified = require("unified");
const rehypeParse = require("rehype-parse");
const selectAll = require("hast-util-select").selectAll;

const inlineNodeContents = (
  rootNode,
  { css = true, js = true, images = true, svgElements = false }
) => {
  if (css) {
    const linkElements = selectAll("link", rootNode);
    linkElements.forEach(element => {
      const stylesheetContent = fs.readFileSync(element.properties.href, {
        encoding: "utf-8"
      });
      element.tagName = "style";
      // remove previous props
      element.properties = {};
      element.children = [{ type: "text", value: stylesheetContent }];
    });
  }
  if (js) {
    const scriptElements = selectAll("script", rootNode);
    scriptElements.forEach(element => {
      const scriptLocation = element.properties.src;
      if (scriptLocation) {
        const scriptContent = fs.readFileSync(scriptLocation, {
          encoding: "utf-8"
        });
        element.properties = {};
        element.children = [{ type: "text", value: scriptContent }];
      }
    });
  }
  if (images) {
    const imgElements = selectAll("img", rootNode);
    imgElements.forEach(image => {
      const imgPath = image.properties.src;
      const fileExt = imgPath.match("\\.([a-zA-Z]+)$")[1];
      if (fileExt === undefined || fileExt === null) {
        throw new Error("image path without file extension");
      }
      if (fileExt === "svg" && svgElements) {
        const svgContent = fs.readFileSync(image.properties.src, {
          encoding: "utf-8"
        });
        const svgParser = unified().use(rehypeParse, {
          fragment: true,
          space: "svg"
        });
        const svgDoc = svgParser.parse(svgContent);
        for (let childNode of svgDoc.children) {
          if (childNode.type === "element") {
            svgNode = childNode;
            break;
          }
        }
        image.tagName = "svg";
        image.properties = svgNode.properties;
        image.children = svgNode.children;
      } else {
        const imgContent = fs.readFileSync(image.properties.src, "base64");
        image.properties.src = `data:image/${fileExt};base64,${imgContent}`;
      }
    });
  }
  return rootNode;
};

/**
 * Transformer for unified.js / rehype that inlines assets like css, js and images
 *
 * Text files are expected to be utf-8 encoded
 */
const inline = ({
  css = true,
  js = true,
  images = true,
  svgElements = false
} = {}) => {
  return rootNode =>
    inlineNodeContents(rootNode, {
      css,
      js,
      images,
      svgElements
    });
};

module.exports = inline;
