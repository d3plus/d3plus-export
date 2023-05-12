# d3plus-export

[![NPM Release](http://img.shields.io/npm/v/d3plus-export.svg?style=flat)](https://www.npmjs.org/package/d3plus-export) [![Build Status](https://travis-ci.org/d3plus/d3plus-export.svg?branch=master)](https://travis-ci.org/d3plus/d3plus-export) [![Dependency Status](http://img.shields.io/david/d3plus/d3plus-export.svg?style=flat)](https://david-dm.org/d3plus/d3plus-export) [![Gitter](https://img.shields.io/badge/-chat_on_gitter-brightgreen.svg?style=flat&logo=gitter-white)](https://gitter.im/d3plus/)

Export methods for transforming and downloading SVG.

## Installing

If you use NPM, `npm install d3plus-export`. Otherwise, download the [latest release](https://github.com/d3plus/d3plus-export/releases/latest). You can also load d3plus-export as a standalone library or as part of [D3plus](https://github.com/d3plus/d3plus). ES modules, AMD, CommonJS, and vanilla environments are supported. In vanilla, a `d3plus` global is exported:

```html
<script src="https://cdn.jsdelivr.net/npm/d3plus-export@1"></script>
<script>
  console.log(d3plus);
</script>
```

## API Reference

##### 
* [saveElement](#saveElement) - Downloads an HTML Element as a bitmap PNG image.

---

<a name="saveElement"></a>
#### d3plus.**saveElement**(elem, [options], [renderOptions]) [<>](https://github.com/d3plus/d3plus-export/blob/master/src/saveElement.js#L9)

Downloads an HTML Element as a bitmap PNG image.


This is a global function.

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| elem | <code>HTMLElement</code> |  | A single element to be saved to one file. |
| [options] | <code>Object</code> |  | Additional options to specify. |
| [options.filename] | <code>String</code> | <code>&quot;download&quot;</code> | Filename for the downloaded file, without the extension. |
| [options.type] | <code>String</code> | <code>&quot;png&quot;</code> | File type of the saved document. Accepted values are `"png"` and `"jpg"`. |
| [options.callback] | <code>function</code> |  | Function to be invoked after saving is complete. |
| [renderOptions] | <code>Object</code> |  | Custom options to be passed to the html-to-image function. |


---



###### <sub>Documentation generated on Fri, 12 May 2023 19:21:45 GMT</sub>
