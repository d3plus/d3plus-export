import {select} from "d3-selection";

/**
    @function htmlPresets
    @desc Adds HTML default styles to a d3 selection in order to render it properly.
    @param {Selection} selection
*/
export default function(selection) {

  selection.selectAll("*")
    .each(function() {
      const tag = this.tagName.toLowerCase();
      if (!["option"].includes(tag)) {

        const elem = select(this);

        /* forces minor unnoticible letter-spacing on any element where it is not defined to fix IE */
        const letterSpacing = elem.style("letter-spacing");
        elem.style("letter-spacing", letterSpacing === "normal" ? "0.1px" : letterSpacing);

      }
    });

}
