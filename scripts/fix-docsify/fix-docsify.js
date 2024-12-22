const {readFile, outputFile} = require('fs-extra')
const {resolve} = require('path')
const { replace } = require('rambdax')

const library = process.env.WITH_RAMBDAX === 'ON' ? 'rambdax' : 'rambda'
const localDocsify = process.env.LOCAL_DOCSIFY === 'ON'

let plugin = `
  <script src="//cdn.jsdelivr.net/npm/docsify/lib/plugins/search.min.js"></script>
</body>
`.trim()

let plugin2 = `
      repo: '',
      search: {
        depth: 3,
      }
`.trim()

let localDocsifyPath = resolve(__dirname, `../../docsify-readme/docs/index.html`)

void (async function main() {
  const location = localDocsify ? localDocsifyPath : resolve(__dirname, `../../../${library}/docs/index.html`)
  const content = (await readFile(location)).toString()
  const fixed = replace(/Document/g, 'Rambda documentation', content)
  let withPlugin = replace(/<\/body>/, plugin, fixed)
  let withPlugin2 = replace(`repo: ''`, plugin2, withPlugin)
  console.log('Fixed docsify')
  await outputFile(location, withPlugin2)
})()
