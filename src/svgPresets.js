/**
    @function svgPresets
    @desc Adds SVG default attributes to a d3 selection in order to render it properly.
    @param {Selection} selection
*/
export default function(selection) {

  // sets "stroke-width" attribute to `0` if not defined
  const strokeWidth = selection.attr("stroke-width");
  selection.attr("stroke-width", !strokeWidth ? 0 : strokeWidth);

  // if there is no stroke, set the stroke color to "transparent" (fixes weird text rendering)
  if (!strokeWidth) selection.attr("stroke", "transparent");

  // sets "fill-opacity" attribute to `0` if fill is "transparent" or "none"
  const transparent = ["none", "transparent"].includes(selection.attr("fill"));
  const fillOpacity = selection.attr("fill-opacity");
  selection.attr("fill-opacity", transparent ? 0 : fillOpacity);

  // "aria-label" properties interfere with text labels ¯\_(ツ)_/¯
  selection.attr("aria-label", null);

}
