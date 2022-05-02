import "canvas-toBlob";
import {select} from "d3-selection";
import {saveAs} from "file-saver";
// import JsPDF from "jspdf";

import dom2canvas from "./dom2canvas";
import svgPresets from "./svgPresets";

const defaultOptions = {
  filename: "download",
  type: "png"
};

/**
    @function saveElement
    @desc Downloads an HTML Element as a bitmap PNG image.
    @param {HTMLElement|Array} elem A single element or array of elements to be saved to one file.
    @param {Object} [options] Additional options to specify.
    @param {String} [options.filename = "download"] Filename for the downloaded file, without the extension.
    @param {String} [options.type = "png"] File type of the saved document. Accepted values are `"png"` and `"jpg"`.
    @param {Function} [options.callback] Function to be invoked after saving is complete.
    @param {Object} [renderOptions] Custom options to be passed to the dom2canvas function.
*/
export default function(elem, options = {}, renderOptions = {}) {

  if (!elem) return;
  options = Object.assign({}, defaultOptions, options);

  const IE = new RegExp(/(MSIE|Trident\/|Edge\/)/i).test(navigator.userAgent);

  if (!(elem instanceof Array) && options.type === "svg") {
    const clone = elem.cloneNode(true);
    select(clone).call(svgPresets);
    select(clone).selectAll("*").each(function() {
      select(this).call(svgPresets);
    });
    const outer = IE ? new XMLSerializer().serializeToString(clone) : clone.outerHTML;
    saveAs(new Blob([outer], {type: "application/svg+xml"}), `${options.filename}.svg`);

    if (options.callback) options.callback();

  }
  else {

    dom2canvas(elem, Object.assign({}, renderOptions, {callback: canvas => {

      if (["jpg", "png"].includes(options.type)) {
        canvas.toBlob(blob => saveAs(blob, `${options.filename}.${options.type}`));
      }
      // else if (options.type === "pdf") {

      //   const outputHeight = 11,
      //         outputWidth = 8.5;

      //   const aspect = canvas.width / canvas.height,
      //         orientation = aspect > 1 ? "landscape" : "portrait";

      //   const pdf = new JsPDF({
      //     orientation,
      //     unit: "in",
      //     format: [outputWidth, outputHeight]
      //   });

      //   let h = orientation === "landscape" ? outputWidth : outputHeight,
      //       left,
      //       top,
      //       w = orientation === "landscape" ? outputHeight : outputWidth;

      //   const margin = 0.5;

      //   if (aspect < w / h) {
      //     h -= margin * 2;
      //     const tempWidth = h * aspect;
      //     top = margin;
      //     left = (w - tempWidth) / 2;
      //     w = tempWidth;
      //   }
      //   else {
      //     w -= margin * 2;
      //     const tempHeight = w / aspect;
      //     left = margin;
      //     top = (h - tempHeight) / 2;
      //     h = tempHeight;
      //   }

      //   pdf.addImage(canvas, "canvas", left, top, w, h);
      //   pdf.save(options.filename);

      // }

      if (options.callback) options.callback();

    }}));

  }

}
