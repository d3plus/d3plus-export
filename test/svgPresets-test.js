import assert from "assert";
import {select} from "d3-selection";
import {default as svgPresets} from "../src/svgPresets.js";
import it from "./jsdom.js";

it("svgPresets", "<svg><line id='test' /></svg>", () => {

  const line = select("#test");
  svgPresets(line);
  assert.strictEqual(line.attr("stroke-width"), "0", "applies 0 stroke-width");
  assert.strictEqual(line.attr("stroke"), "transparent", "applies transparent stroke");

});