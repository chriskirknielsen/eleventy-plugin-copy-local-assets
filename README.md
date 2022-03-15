# eleventy-plugin-copy-local-assets

Set up a dynamic passthrough copy in Eleventy for a folder holding both the content file and the assets used on the page.

### When do I need this?

This allows you to save a page's assets within the same folder as the content itself. For example, imagine a special page within a folder:

```
.
+-- /sample
|   +-- /index.md (Content file)
|   +-- /diamond.svg (Asset file)
```

Instead of reaching for a filter to resolve the URL to your common assets folder, this "one-off" asset is accessible within the same folder, so you are able to find it with `./` and no other processing. This means you don't need to manually edit your Eleventy configuration file to passthrough your assets from that folder — it is all dynamically handled by the plugin.

**Define a `copyLocalAssets` entry with a glob string or a `true` boolean in your frontmatter, and that's it.**

## Usage

Install the package from NPM:

```bash
npm install eleventy-plugin-copy-local-assets
```

Then, include it in your `.eleventy.js` config file:

```js
const copyLocalAssets = require("eleventy-plugin-copy-local-assets");

module.exports = (eleventyConfig) => {
	eleventyConfig.addPlugin(copyLocalAssets, { verbose: false });
};
```

## Frontmatter examples


```yaml
---
title: Boolean Example
copyLocalAssets: true
---
```

```yaml
---
title: glob + Permalink Example
permalink: /sample/working-example/index.html
copyLocalAssets: '*.svg'
---
```

**Note:** You can rewrite the permalink and the assets will be in the same folder as the content file.

## Config options

| Option    | Type    | Default |
| --------- | ------- | ------- |
| `verbose` | boolean | `false` |

When the `verbose` option is set to `true`, the console will log each file it finds with a truthy `filesToCopy` and report the input file, output file, and the number of files matching the provided glob.

## Credits

-   **99.9% of the work was done by [Balazs HIDEGHETY](https://github.com/hidegh) based upon [this wonderful comment](https://github.com/11ty/eleventy/issues/379#issuecomment-779705668) — my only contribution is to turn it into a plugin and add a frontmatter flag check.**

-   [Eleventy Plugin Template](https://github.com/5t3ph/eleventy-plugin-template) by [Stephanie Eckles](https://github.com/5t3ph) made my life a bit easier!

## Contributors

-   [Austen Lamacraft ](https://github.com/AustenLamacraft)
