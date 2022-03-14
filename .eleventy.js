const path = require("path");
const fs = require("fs");
const glob = require ("glob");

module.exports = (eleventyConfig, options) => {
    const defaults = {
        verbose: false
    };

    eleventyConfig.addTransform("copyLocalAssets", function(content, outputPath) {
        // HUGO logic:
        // - if multiple *.md are in a folder (ignoring _index.html) - then no asset-copy over will occur
        // - if single index.html (allowing extra _index.html), then no further sub-dirs will be processed, all sub-dirs and files will be copied (except *.md)
        //
        // Alg:
        // - get all md/html/njk in the directory and sub-dirs, ignoring _index.* (_index.* - could be later used to create list-templates)
        // - if only 1 found = we copy the entire sub-content
        // - otherwise do no copy-over nothing
        
        const template = this;

        // Ignore pages that don't have `copyLocalAssets` in the frontmatter, or have a falsy value
        if (!template.dataCache.copyLocalAssets) { return content; }

        const opts = {
            ...defaults,
            ...options,
        };
        
        const outputDir = path.dirname(outputPath);       
        const templateDir = path.dirname(template.inputPath).replace(/^\.\//, "");
        const templateFileName = path.basename(template.inputPath);
        const assetsNameMatch = (typeof template.dataCache.copyLocalAssets === 'string') ? template.dataCache.copyLocalAssets : '*';

        const extensionsRegex = template._config.templateFormats.join(",");
        const mdSearchPattern = path.join(templateDir, `**/*.{${ extensionsRegex }}`);
        const mdIgnorePattern = path.join(templateDir, `**/_index.{${ extensionsRegex }}`);

        const entries = glob.sync(mdSearchPattern, { nodir: true, ignore: mdIgnorePattern });
        // only 1 page template allowed when copying assets
        if (entries.length > 1) {
            console.info(`Skipping copying over files from: ${templateDir} as multiple templates found in directory!`);
            return content;
        }

        // copy all hierarchically, except templates
        const fileSearchPattern = path.join(templateDir, `**/${ assetsNameMatch }`);
        const fileIgnorePattern = path.join(templateDir, `**/*.{${ extensionsRegex }}`);

        const filesToCopy = glob.sync(fileSearchPattern, { nodir: true, ignore: fileIgnorePattern });
        if (opts.verbose) {
            console.info(`# copy-local-assets - input: ${template.inputPath}, output: ${outputPath}, with ${filesToCopy.length} asset${filesToCopy.length!==1?'s':''} matching "${assetsNameMatch}"`);
        }

        for (let filePath of filesToCopy) {
            // strip template dir
            // prepend output dir
            const destPath = path.join(
                outputDir,
                filePath.substr(templateDir.length)
            );

            const destDir = path.dirname(destPath);

            fs.mkdirSync(destDir, { recursive: true });
            fs.copyFileSync(filePath, destPath);
        }

        // keep original content
        return content;
    });
}
