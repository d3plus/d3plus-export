# d3plus-export

[![NPM Release](http://img.shields.io/npm/v/d3plus-export.svg?style=flat)](https://www.npmjs.org/package/d3plus-export)
[![Build Status](https://travis-ci.org/d3plus/d3plus-export.svg?branch=master)](https://travis-ci.org/d3plus/d3plus-export)
[![Dependency Status](http://img.shields.io/david/d3plus/d3plus-export.svg?style=flat)](https://david-dm.org/d3plus/d3plus-export)
[![Slack](https://img.shields.io/badge/Slack-Click%20to%20Join!-green.svg?style=social)](https://goo.gl/forms/ynrKdvusekAwRMPf2)

Export methods for transforming and downloading SVG.

## Installing

If you use NPM, `npm install d3plus-export`. Otherwise, download the [latest release](https://github.com/d3plus/d3plus-export/releases/latest). The released bundle supports AMD, CommonJS, and vanilla environments. Create a [custom bundle using Rollup](https://github.com/rollup/rollup) or your preferred bundler. You can also load directly from [d3plus.org](https://d3plus.org):

```html
<script src="https://d3plus.org/js/d3plus-export.v0.1.full.min.js"></script>
```


## API Reference
<a name="savePNG"></a>

### savePNG(elem, [options])
Downloads an HTML Element as a bitmap PNG image.

**Kind**: global function  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| elem | <code>HTMLElement</code> |  | The element to be saved. |
| [options] | <code>String</code> |  | Additional options to specify. |
| [options.callback] | <code>function</code> |  | Callback function to be passed the canvas element after rendering. |
| [options.filename] | <code>String</code> | <code>&quot;download&quot;</code> | Filename for the downloaded file, without the extension. |
| [options.padding] | <code>Number</code> | <code>0</code> | Outer padding for the final file. |
| [options.scale] | <code>Number</code> | <code>1</code> | Scale for the final file. |



###### <sub>Documentation generated on Fri, 24 Mar 2017 19:50:11 GMT</sub>
