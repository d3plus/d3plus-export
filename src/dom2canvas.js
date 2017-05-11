import html2canvas from "html2canvas";
import canvg from "canvg-browser";
import {select, selectAll} from "d3-selection";

const defaultOptions = {
  background: false,
  callback: () => {},
  excludes: [],
  padding: 0,
  scale: 1
};

const canvgOptions = {
  ignoreMouse: true,
  ignoreAnimation: true,
  ignoreDimensions: true,
  ignoreClear: true
};

/**
    @function dom2canvas
    @desc Renders HTML/SVG elements to a shared canvas.
    @param {HTMLElement|Object|Array} elem The element or array of elements to be rendered to a single canvas. Additionally, a complex object can be passed as an element which can contain specific other properties.
    @param {Number} [elem.x] The x offset of the element within the rendered canvas.
    @param {Number} [elem.y] The y offset of the element within the rendered canvas.
    @param {Object} [options] Additional options to specify.
    @param {String} [options.background] Background color of the rendered canvas.
    @param {Function} [options.callback] Callback function to be passed the canvas element after rendering.
    @param {Array} [options.excludes] An array of HTMLElement objects to be excluded from the render.
    @param {Number} [options.height] Pixel height for the final output. If a height value has not been passed, it will be inferred from the sizing of the first DOM element passed.
    @param {Number} [options.padding = 0] Outer padding for the final file.
    @param {Number} [options.scale = 1] Scale for the final file.
    @param {Number} [options.width] Pixel width for the final output. If a width value has not been passed, it will be inferred from the sizing of the first DOM element passed.
*/
export default function(elem, options) {

  if (!elem) return;
  if (!(elem instanceof Array)) elem = [elem];

  options = Object.assign({}, defaultOptions, options);
  const IE = new RegExp(/(MSIE|Trident\/|Edge\/)/i).test(navigator.userAgent);
  const ratio = window ? window.devicePixelRatio || 1 : 1;

  function strokeWidth(selection) {
    const stroke = selection.attr("stroke-width");
    selection.attr("stroke-width", !stroke ? 0 : stroke * ratio);
  }

  let reference = elem[0];
  if (reference.constructor === Object) reference = reference.element;

  const height = options.height || parseFloat(select(reference).style("height")),
        width = options.width || parseFloat(select(reference).style("width"));

  let offsetX = 0, offsetY = 0, layerX, layerY;
  if (reference.getBoundingClientRect) {
    const bounds = reference.getBoundingClientRect();
    offsetX = bounds.left;
    offsetY = bounds.top;
  }
  else {
    offsetX = reference.offsetLeft;
    offsetY = reference.offsetTop;
  }

  const canvas = document.createElement("canvas");
  canvas.width = (width + options.padding * 2) * options.scale * ratio;
  canvas.height = (height + options.padding * 2) * options.scale * ratio;
  canvas.style.width = (width + options.padding * 2) * options.scale;
  canvas.style.height = (height + options.padding * 2) * options.scale;

  const context = canvas.getContext("2d");
  context.scale(options.scale * ratio, options.scale * ratio);
  context.clearRect(0, 0, canvas.width / 2, canvas.height / 2);

  if (options.background) {
    context.beginPath();
    context.rect(0, 0, canvas.width / 2, canvas.height / 2);
    context.fillStyle = options.background;
    context.fill();
  }

  const layers = [];

  function checkRender(trans) {

    if (options.exclude.includes(this)) return;

    const transform = Object.assign({}, trans);

    // strips translate and scale from transform property
    if (this.tagName) {

      const opacity = select(this).attr("opacity") || select(this).style("opacity");
      const display = select(this).style("display");
      const visibility = select(this).style("visibility");
      if (display === "none" || visibility === "hidden" || opacity && opacity === 0) return;

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

        layers.push({type: "text", style: this.parentNode, value: text, x: transform.x, y: transform.y});

      }
    }
    else if (tag === "defs") return;
    else if (tag === "text") {
      const elem = this.cloneNode(true);
      select(elem).call(strokeWidth);
      layers.push(Object.assign({}, transform, {type: "svg", value: elem}));
    }
    else if (["div", "foreignobject", "span"].includes(tag) && !select(this).selectAll("svg").size()) {

      const data = {
        height,
        loaded: false,
        type: "html",
        width,
        x: layerX - offsetX,
        y: layerY - offsetY
      };

      const tempCanvas = document.createElement("canvas");
      tempCanvas.width = (width + options.padding * 2) * options.scale * ratio;
      tempCanvas.height = (height + options.padding * 2) * options.scale * ratio;

      const tempContext = tempCanvas.getContext("2d");
      tempContext.scale(options.scale * ratio, options.scale * ratio);

      layers.push(data);
      html2canvas(this, {
        allowTaint: true,
        background: undefined,
        canvas: tempCanvas,
        height,
        letterRendering: true,
        taintTest: false,
        width
      }).then(c => {
        data.value = c;
        data.loaded = true;
      });

    }
    else if (this.childNodes.length > 0) {
      if (tag === "svg") {
        const rect = this.getBoundingClientRect();
        transform.x += rect.left - offsetX;
        transform.y += rect.top - offsetY;
      }
      checkChildren(this, transform);
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
          canvas2.height = height * ratio;
          canvas2.width = width * ratio;
          ctx2.drawImage(this, 0, 0, width * ratio, height * ratio);
          const himg = document.createElement("img");
          himg.src = canvas2.toDataURL("image/png");

          data.value = himg;
          data.loaded = true;

        };
        img.src = url;

      }

    }
    else if (tag !== "g") { // catches all SVG shapes

      const elem = this.cloneNode(true);
      select(elem).call(strokeWidth);
      layers.push(Object.assign({}, transform, {type: "svg", value: elem}));
      // if (["pattern"].includes(tag)) layers.push(Object.assign({}, transform, {type: "svg", value: elem}));
      // else layers.push({type: "svg", value: elem});
      const fill = select(elem).attr("fill");
      if (fill && fill.indexOf("url") === 0) {
        const property = select(elem).attr("transform");

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

  }

  function checkChildren(e, trans) {
    selectAll(e.childNodes).each(function() {
      checkRender.bind(this)(trans);
    });
  }

  for (let i = 0; i < elem.length; i++) {

    let e = elem[i],
        options = {scale: 1, x: 0, y: 0};

    if (e.constructor === Object) {
      options = Object.assign(options, e);
      e = e.element;
    }
    layerX = options.x;
    layerY = options.y;
    checkRender.bind(e)(options);

  }

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

        case "html":
          context.save();
          context.beginPath();
          context.translate(options.padding, options.padding);
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
          canvg(canvas, text, Object.assign({offsetX: layer.x, offsetY: layer.y}, canvgOptions));
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

    options.callback(canvas);

  }

}