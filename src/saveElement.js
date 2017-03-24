import "canvas-toBlob";
import canvg from "canvg-browser";
import {select, selectAll} from "d3-selection";
import {saveAs} from "file-saver";
// import {default as JsPDF} from "jspdf";

const defaultOptions = {
  callback: () => {},
  filename: "download",
  padding: 0,
  scale: 1,
  type: "png"
};

const canvgOptions = {
  ignoreMouse: true,
  ignoreAnimation: true,
  ignoreDimensions: true,
  ignoreClear: true
};

/**
    @function savePNG
    @desc Downloads an HTML Element as a bitmap PNG image.
    @param {HTMLElement} elem The element to be saved.
    @param {String} [options] Additional options to specify.
    @param {Function} [options.callback] Callback function to be passed the canvas element after rendering.
    @param {String} [options.filename = "download"] Filename for the downloaded file, without the extension.
    @param {Number} [options.padding = 0] Outer padding for the final file.
    @param {Number} [options.scale = 1] Scale for the final file.
*/
export default function(elem, options) {

  if (!elem) return;
  options = Object.assign({}, defaultOptions, options);
  const IE = new RegExp(/(MSIE|Trident\/|Edge\/)/i).test(navigator.userAgent);

  if (options.type === "svg") {
    const outer = IE ? (new XMLSerializer()).serializeToString(elem) : elem.outerHTML;
    saveAs(new Blob([outer], {type: "application/svg+xml"}), `${options.filename}.svg`);
    return;
  }

  const height = parseFloat(select(elem).style("height")),
        width = parseFloat(select(elem).style("width"));

  const canvas = document.createElement("canvas");
  canvas.width = (width + options.padding * 2) * options.scale;
  canvas.height = (height + options.padding * 2) * options.scale;

  const context = canvas.getContext("2d");
  context.scale(options.scale, options.scale);
  context.clearRect(0, 0, canvas.width / 2, canvas.height / 2);

  if (options.type === "pdf") {
    context.beginPath();
    context.rect(0, 0, canvas.width / 2, canvas.height / 2);
    context.fillStyle = "white";
    context.fill();
  }

  const layers = [];

  function checkChildren(e, trans = {x: 0, y: 0, scale: 1}) {
    selectAll(e.childNodes).each(function() {
      const transform = Object.assign({}, trans);

      // strips translate and scale from transform property
      if (this.tagName) {

        const property = select(this).attr("transform"),
              tag = this.tagName.toLowerCase();

        if (tag === "g" && property) {
          const scale = property.match(/scale\(([^a-z]+)\)/i);
          if (scale) transform.scale *= Math.round(parseFloat(scale[1]));
          const translate = property.match(/translate\(([^a-z]+)\)/i);
          if (translate) {
            const [x, y] = translate[1]
              .replace(/([^a-z]),*\s([^a-z])/gi, "$1,$2")
              .split(",")
              .map(d => Math.round(parseFloat(d) * transform.scale));
            transform.x += x;
            transform.y += y;
          }
        }

        if (tag === "svg") {
          let x = select(this).attr("x");
          x = x ? Math.round(parseFloat(x)) * transform.scale : 0;
          transform.x += x;
          let y = select(this).attr("y");
          y = y ? Math.round(parseFloat(y)) * transform.scale : 0;
          transform.y += y;
          transform.clip = {
            height: Math.round(parseFloat(select(this).attr("height") || select(this).style("height"))),
            width: Math.round(parseFloat(select(this).attr("width") || select(this).style("width"))),
            x, y
          };
        }
        else {
          const x = select(this).attr("x");
          if (x) transform.x += parseFloat(x) * transform.scale;
          const y = select(this).attr("y");
          if (y) transform.y += parseFloat(y) * transform.scale;
        }

      }

      const tag = (this.tagName || "").toLowerCase();

      const patterns = tag.length ? select(this).selectAll("*")
        .filter(function() {
          const fill = select(this).attr("fill");
          return fill && fill.indexOf("url") === 0;
        }).size() : 0;

      if (!tag.length) {
        const test = (this.wholeText || "").replace(/\s/g, "");
        if (test.length) {

          const text = this.nodeValue
            .replace(/^\s*/, "")
            .replace(/^\n/, "")
            .replace(/^\s*/, "")
            .replace(/\n$/, "")
            .replace(/\s*$/, "")
            .replace(/\n$/, "");

          layers.push({type: "text", style: this.parentNode, value: text});

        }
      }
      else if (tag === "defs") return;
      else if (tag === "g" && this.childNodes.length > 0 && !select(this).selectAll("pattern, image, foreignobject").size() && !patterns) {
        const opacity = select(this).attr("opacity") || select(this).style("opacity");
        if (opacity && parseFloat(opacity) > 0) {
          select(this).selectAll("*").each(function() {
            if (select(this).attr("stroke-width") === null) select(this).attr("stroke-width", 0);
          });
          layers.push(Object.assign({}, transform, {type: "svg", value: this}));
        }
      }
      else if (tag === "text") {
        if (select(this).attr("stroke-width") === null) select(this).attr("stroke-width", 0);
        layers.push(Object.assign({}, transform, {type: "svg", value: this}));
      }
      else if (this.childNodes.length > 0) {
        const opacity = select(this).attr("opacity") || select(this).style("opacity");
        if (opacity && parseFloat(opacity) > 0) checkChildren(this, transform);
      }
      else if (["image", "img"].includes(tag)) {

        const url = select(this).attr("href") || select(this).attr("xlink:href");

        if (url.length) {
          const height = parseFloat(select(this).attr("height")) * transform.scale,
                width = parseFloat(select(this).attr("width")) * transform.scale;

          const data = {
            clip: transform.clip,
            height,
            loaded: false,
            type: "img",
            width,
            x: transform.x,
            y: transform.y
          };
          layers.push(data);

          const img = new Image();
          img.crossOrigin = "Anonymous";
          img.onload = function() {

            const canvas2 = document.createElement("canvas");
            const ctx2 = canvas2.getContext("2d");
            canvas2.height = height;
            canvas2.width = width;
            ctx2.drawImage(this, 0, 0, width, height);
            const himg = document.createElement("img");
            himg.src = canvas2.toDataURL("image/png");

            data.loaded = true;
            data.value = himg;

          };
          img.src = url;

        }

      }
      else {

        if (select(this).attr("stroke-width") === null) select(this).attr("stroke-width", 0);
        layers.push(Object.assign({}, transform, {type: "svg", value: this}));
        // if (["pattern"].includes(tag)) layers.push(Object.assign({}, transform, {type: "svg", value: this}));
        // else layers.push({type: "svg", value: this});
        const fill = select(this).attr("fill");
        if (fill && fill.indexOf("url") === 0) {
          const property = select(this).attr("transform");

          if (property) {
            const scale = property.match(/scale\(([^a-z]+)\)/i);
            if (scale) transform.scale *= Math.round(parseFloat(scale[1]));
            const translate = property.match(/translate\(([^a-z]+)\)/i);
            if (translate) {
              const [x, y] = translate[1]
                .replace(/([^a-z]),*\s([^a-z])/gi, "$1,$2")
                .split(",")
                .map(d => Math.round(parseFloat(d) * transform.scale));
              transform.x += x;
              transform.y += y;
            }
          }
          checkChildren(select(fill.slice(4, -1)).node(), transform);
        }

      }

    });
  }
  checkChildren(elem);

  function checkStatus() {

    let allDone = true;
    for (let i = 0; i < layers.length; i++) {
      if (layers[i].loaded === false) {
        allDone = false;
        break;
      }
    }

    if (allDone) finish();
    else setTimeout(checkStatus, 500);

  }

  // Wait for all images to load
  checkStatus();

  function finish() {

    for (let i = 0; i < layers.length; i++) {

      const layer = layers[i];
      const {clip} = layer;

      switch (layer.type) {

        case "img":
          context.save();
          context.beginPath();
          context.translate(options.padding, options.padding);
          context.rect(clip ? clip.x : 0, clip ? clip.y : 0, clip ? clip.width : width, clip ? clip.height : height);
          context.clip();
          context.drawImage(layer.value, layer.x, layer.y, layer.width, layer.height);
          context.restore();
          break;

        case "text":

          const parent = select(layer.style);
          const title = layer.value
            .replace(/&/g, "&amp;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");

          const fC = parent.style("color"),
                fS = parent.style("font-size");

          let fF = parent.style("font-family").split(",")[0];

          if (fF.indexOf("'") !== 0) fF = `'${fF}'`;
          const text = `<text stroke='none' dy='${fS}' fill='${fC}' font-family=${fF} font-size='${fS}'>${title}</text>`;

          context.save();
          context.translate(options.padding, options.padding);
          canvg(canvas, text, canvgOptions);
          context.restore();

          break;

        case "svg":
          const outer = IE ? (new XMLSerializer()).serializeToString(layer.value) : layer.value.outerHTML;
          context.save();
          context.translate(options.padding, options.padding);
          context.rect(clip ? clip.x : 0, clip ? clip.y : 0, clip ? clip.width : width, clip ? clip.height : height);
          context.clip();
          canvg(canvas, outer, Object.assign({offsetX: layer.x, offsetY: layer.y}, canvgOptions));
          context.restore();
          break;

        default:
          console.warn("uncaught", layer);
          break;

      }

    }

    if (["jpg", "png"].includes(options.type)) {
      canvas.toBlob(blob => saveAs(blob, options.filename));
    }
    // else if (options.type === "pdf") {
    //
    //   const outputHeight = 11,
    //         outputUnit = "in",
    //         outputWidth = 8.5;
    //
    //   const aspect = canvas.width / canvas.height,
    //         orientation = aspect > 1 ? "landscape" : "portrait";
    //
    //   const pdf = new JsPDF(orientation, outputUnit, [outputWidth, outputHeight]);
    //
    //   let h = orientation === "landscape" ? outputWidth : outputHeight,
    //       left,
    //       top,
    //       w = orientation === "landscape" ? outputHeight : outputWidth;
    //
    //   const margin = 0.5;
    //
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
    //
    //   pdf.addImage(canvas, "canvas", left, top, w, h);
    //   pdf.save(options.filename);
    //
    // }

    options.callback(canvas);

  }

}
