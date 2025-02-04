const { readFile, outputFile, copy, remove, unlink } = require('fs-extra');
const { resolve } = require('node:path');
const { replace } = require('rambdax');
const { titleCase } = require('string-fn');

const library = process.env.WITH_RAMBDAX === 'ON' ? 'rambdax' : 'rambda';

const plugin = `
  <script src="//cdn.jsdelivr.net/npm/docsify/lib/plugins/search.min.js"></script>
</body>
`.trim();

const pluginSecond = `
      repo: '',
      search: {
        depth: 3,
      }
`.trim();

const localDocsifyPath = resolve(__dirname, '../../docsify-readme/docs/index.html');
const localDocsifyDirectory = resolve(__dirname, '../../docsify-readme');

void (async function main() {
	const libraryDirectory = resolve(__dirname, `../../../${library}`);
	const content = (await readFile(localDocsifyPath)).toString();
	const fixed = replace(/Document/g, `${titleCase(library)} documentation`, content);
	const withPlugin = replace(/<\/body>/, plugin, fixed);
	const withPluginSecond = replace(`repo: ''`, pluginSecond, withPlugin);
	await outputFile(localDocsifyPath, withPluginSecond);
	// console.log({libraryDirectory, localDocsifyDirectory})
	// move `localDocsifyDirectory` to
	// `libraryDirectory` overwriting in case that there
	// is existing folder 
	await unlink(`${ localDocsifyDirectory }/README.md`)
	await copy(localDocsifyDirectory, libraryDirectory, {overwrite: true});
})();
