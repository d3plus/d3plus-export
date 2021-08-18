/**
    @function svgPresets
    @desc Adds SVG default attributes to a d3 selection in order to render it properly.
    @param {Selection} selection
*/
export default function(selection) {

  if (!selection || !selection.size()) return;

  // sets "stroke-width" attribute to `0` if not defined
  const strokeWidth = selection.attr("stroke-width");
  selection.attr("stroke-width", !strokeWidth ? 0 : strokeWidth);

  // if there is no stroke, set the stroke color to "transparent" (fixes weird text rendering)
  if (!strokeWidth) selection.attr("stroke", "transparent");

  // sets "fill" attribute to black if not defined
  const fill = selection.attr("fill");
  if (!fill && selection.node().tagName === "text") selection.attr("fill", "#000");

  // sets "fill-opacity" attribute to `0` if fill is "transparent" or "none"
  const transparent = ["none", "transparent"].includes(selection.attr("fill"));
  const fillOpacity = selection.attr("fill-opacity");
  selection.attr("fill-opacity", transparent ? 0 : fillOpacity);

  // "aria-label" properties interfere with text labels ¯\_(ツ)_/¯
  selection.attr("aria-label", null);

  // sets NaN positions to zero
  const x = selection.attr("x");
  if (x === "NaN") selection.attr("x", "0px");
  const y = selection.attr("y");
  if (y === "NaN") selection.attr("y", "0px");

  // fixed relative URLs for SVG downloads
  const url = selection.attr("xlink:href");
  if (url && typeof window !== "undefined" && url.charAt(0) === "/") {
    selection.attr("xlink:href", `${window.location.origin}${url}`);
  }

}
