# d3plus-export

Export methods for transforming and downloading SVG.

## Installing

If using npm, `npm install d3plus-export`. Otherwise, you can download the [latest release from GitHub](https://github.com/d3plus/d3plus-export/releases/latest) or load from a [CDN](https://cdn.jsdelivr.net/npm/d3plus-export@1).

```js
import modules from "d3plus-export";
```

d3plus-export can be loaded as a standalone library or bundled as part of [D3plus](https://github.com/d3plus/d3plus). ES modules, AMD, CommonJS, and vanilla environments are supported. In vanilla, a `d3plus` global is exported:

```html
<script src="https://cdn.jsdelivr.net/npm/d3plus-export@1"></script>
<script>
  console.log(d3plus);
</script>
```

## Examples

Live examples can be found on [d3plus.org](https://d3plus.org/), which includes a collection of example visualizations using [d3plus-react](https://github.com/d3plus/d3plus-react/). These examples are powered by the [d3plus-storybook](https://github.com/d3plus/d3plus-storybook/) repo, and PRs are always welcome. :beers:

## API Reference

##### 
* [dom2canvas](#dom2canvas) - Renders HTML/SVG elements to a shared canvas.
* [htmlPresets](#htmlPresets) - Adds HTML default styles to a d3 selection in order to render it properly.
* [saveElement](#saveElement) - Downloads an HTML Element as a bitmap PNG image.
* [svgPresets](#svgPresets) - Adds SVG default attributes to a d3 selection in order to render it properly.

---

<a name="dom2canvas"></a>
#### d3plus.**dom2canvas**(elem, [options]) [<>](https://github.com/d3plus/d3plus-export/blob/master/src/dom2canvas.js#L50)

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
| [options.canvas] | <code>HTMLElement</code> |  | A canvas DOM element to draw onto. If no element is supplied, a canvas element will be created in memory and passed to the callback function when drawing is complete. |
| [options.excludes] | <code>Array</code> |  | An array of HTMLElement objects to be excluded from the render. |
| [options.height] | <code>Number</code> |  | Pixel height for the final output. If a height value has not been passed, it will be inferred from the sizing of the first DOM element passed. |
| [options.padding] | <code>Number</code> | <code>0</code> | Outer padding for the final file. |
| [options.scale] | <code>Number</code> | <code>1</code> | Scale for the final file. |
| [options.width] | <code>Number</code> |  | Pixel width for the final output. If a width value has not been passed, it will be inferred from the sizing of the first DOM element passed. |


---

<a name="htmlPresets"></a>
#### d3plus.**htmlPresets**(selection) [<>](https://github.com/d3plus/d3plus-export/blob/master/src/htmlPresets.js#L3)

Adds HTML default styles to a d3 selection in order to render it properly.


This is a global function.

---

<a name="saveElement"></a>
#### d3plus.**saveElement**(elem, [options], [renderOptions]) [<>](https://github.com/d3plus/d3plus-export/blob/master/src/saveElement.js#L14)

Downloads an HTML Element as a bitmap PNG image.


This is a global function.

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| elem | <code>HTMLElement</code> \| <code>Array</code> |  | A single element or array of elements to be saved to one file. |
| [options] | <code>Object</code> |  | Additional options to specify. |
| [options.filename] | <code>String</code> | <code>&quot;download&quot;</code> | Filename for the downloaded file, without the extension. |
| [options.type] | <code>String</code> | <code>&quot;png&quot;</code> | File type of the saved document. Accepted values are `"png"` and `"jpg"`. |
| [options.callback] | <code>function</code> |  | Function to be invoked after saving is complete. |
| [renderOptions] | <code>Object</code> |  | Custom options to be passed to the dom2canvas function. |


---

<a name="svgPresets"></a>
#### d3plus.**svgPresets**(selection) [<>](https://github.com/d3plus/d3plus-export/blob/master/src/svgPresets.js#L1)

Adds SVG default attributes to a d3 selection in order to render it properly.


This is a global function.

---



###### <sub>Documentation generated on Wed, 25 Jan 2023 14:21:10 GMT</sub>
