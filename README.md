# d3plus-export

[![NPM Release](http://img.shields.io/npm/v/d3plus-export.svg?style=flat)](https://www.npmjs.org/package/d3plus-export) [![Build Status](https://travis-ci.org/d3plus/d3plus-export.svg?branch=master)](https://travis-ci.org/d3plus/d3plus-export) [![Dependency Status](http://img.shields.io/david/d3plus/d3plus-export.svg?style=flat)](https://david-dm.org/d3plus/d3plus-export) [![Gitter](https://img.shields.io/badge/-chat_on_gitter-brightgreen.svg?style=flat&logo=gitter-white)](https://gitter.im/d3plus/) 

Export methods for transforming and downloading SVG.

## Installing

If you use NPM, run `npm install d3plus-export --save`. Otherwise, download the [latest release](https://github.com/d3plus/d3plus-export/releases/latest). The released bundle supports AMD, CommonJS, and vanilla environments. You can also load directly from [d3plus.org](https://d3plus.org):

```html
<script src="https://d3plus.org/js/d3plus-export.v0.3.full.min.js"></script>
```


## API Reference

##### 
* [dom2canvas](#dom2canvas) - Renders HTML/SVG elements to a shared canvas.
* [saveElement](#saveElement) - Downloads an HTML Element as a bitmap PNG image.
* [svgPresets](#svgPresets) - Adds SVG default attributes to a d3 selection in order to redner it properly.

---

<a name="dom2canvas"></a>
#### d3plus.**dom2canvas**(elem, [options]) [<>](https://github.com/d3plus/d3plus-export/blob/master/src/dom2canvas.js#L49)

Renders HTML/SVG elements to a shared canvas.


This is a global function.

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| elem | <code>HTMLElement</code> \| <code>Object</code> \| <code>Array</code> |  | The element or array of elements to be rendered to a single canvas. Additionally, a complex object can be passed as an element which can contain specific other properties. |
| [elem.x] | <code>Number</code> |  | The x offset of the element within the rendered canvas. |
| [elem.y] | <code>Number</code> |  | The y offset of the element within the rendered canvas. |
| [options] | <code>Object</code> |  | Additional options to specify. |
| [options.background] | <code>String</code> |  | Background color of the rendered canvas. |
| [options.callback] | <code>function</code> |  | Callback function to be passed the canvas element after rendering. |
| [options.excludes] | <code>Array</code> |  | An array of HTMLElement objects to be excluded from the render. |
| [options.height] | <code>Number</code> |  | Pixel height for the final output. If a height value has not been passed, it will be inferred from the sizing of the first DOM element passed. |
| [options.padding] | <code>Number</code> | <code>0</code> | Outer padding for the final file. |
| [options.scale] | <code>Number</code> | <code>1</code> | Scale for the final file. |
| [options.width] | <code>Number</code> |  | Pixel width for the final output. If a width value has not been passed, it will be inferred from the sizing of the first DOM element passed. |


---

<a name="saveElement"></a>
#### d3plus.**saveElement**(elem, [options], [renderOptions]) [<>](https://github.com/d3plus/d3plus-export/blob/master/src/saveElement.js#L12)

Downloads an HTML Element as a bitmap PNG image.


This is a global function.

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| elem | <code>HTMLElement</code> \| <code>Array</code> |  | A single element or array of elements to be saved to one file. |
| [options] | <code>Object</code> |  | Additional options to specify. |
| [options.filename] | <code>String</code> | <code>&quot;download&quot;</code> | Filename for the downloaded file, without the extension. |
| [options.type] | <code>String</code> | <code>&quot;png&quot;</code> | File type of the saved document. Accepted values are `"png"` and `"jpg"`. |
| [renderOptions] | <code>Object</code> |  | Custom options to be passed to the dom2canvas function. |


---

<a name="svgPresets"></a>
#### d3plus.**svgPresets**(selection) [<>](https://github.com/d3plus/d3plus-export/blob/master/src/svgPresets.js#L1)

Adds SVG default attributes to a d3 selection in order to redner it properly.


This is a global function.

---



###### <sub>Documentation generated on Wed, 21 Mar 2018 20:07:32 GMT</sub>
