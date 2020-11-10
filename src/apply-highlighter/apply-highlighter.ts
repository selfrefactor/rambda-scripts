import { 
  mapAsync,
  omit,
  match,
  remove,
  forEach,
  replace,
  piped,
  map,
  trim,
  interpolate,
  path,
 } from 'rambdax'
const shiki = require('shiki')
const {indentRight} = require('./utils/indent-right')
const niketaTheme = shiki.loadTheme(`${__dirname}/assets/TripTank.json`)

const initialResolver = {
  '{{LINE}}': '<span class="line">',
  '{{START}}': '<pre class="shiki" style="background-color: #25252A">',
  '{{END}}': '</span></span></code></pre>',
}

export class ApplyHighlighter {
  codeToHtml: (x: string) => string
  resolver: {
    [key: string]: string
  }
  constructor() {
    this.codeToHtml = () => {
      throw new Error('codeToHtml is not ready')
    }
    this.resolver = initialResolver
  }

  async init() {
    const {codeToHtml} = await shiki.getHighlighter({
      theme: niketaTheme,
    })
    this.codeToHtml = codeToHtml
  }

  findColor(input: string) {
    const [colorPart] = match(/color:\s#[a-fA-F0-9]{6,8}/, input)
    if (!colorPart) return

    return remove('color: #', colorPart)
  }

  appendToResolver(highlighted: string) {
    if (!highlighted) return

    const found = match(
      /<span\sstyle="color:\s#[a-fA-F0-9]{6,8}">/gm,
      highlighted
    )

    if (found.length === 0) return
    let template = highlighted

    found.forEach(singleMatch => {
      const color = this.findColor(singleMatch)
      if (!color) return

      if (this.resolver[color] === undefined) {
        this.resolver[color] = singleMatch
      }
      template = replace(
        new RegExp(singleMatch, 'g'),
        `{{${color}}}`,
        template
      )
    })

    forEach((x, prop) => {
      template = replace(new RegExp(x, 'g'), prop, template)
    },initialResolver)

    return template
  }

  getContent(data){
    return (prop, language) => {
      if(!data[prop]) return ''
      const sourceWithFixedLength = indentRight(data[prop])

      return this.codeToHtml(sourceWithFixedLength, language)
    }
  }

  getBenchmarkSource(data){
    const maybeSource = path('benchmarkInfo.benchmarkContent', data)
    if(!maybeSource) return ''

    const sourceWithFixedLength = indentRight(maybeSource)

    return this.codeToHtml(
          fixBenchmarkSource(sourceWithFixedLength),
          'js'
        )
  }

  async apply(source) {
    const iterator = async data => {
      const getContentFn = this.getContent(data)

      const all = {}
      all.benchmarkSource = this.getBenchmarkSource(data)
      all.rambdaSource = getContentFn('rambdaSource', 'js')
      all.rambdaSpecs = getContentFn('rambdaSpecs', 'js')
      all.failedRamdaSpecs = getContentFn('failedRamdaSpecs', 'js')
      all.allTypings = getContentFn('allTypings', 'ts')
      all.typing = getContentFn('typing', 'ts')
      all.typescriptDefinitionTest = getContentFn('typescriptDefinitionTest', 'ts')
      
      const parsedData = piped(
        all,
        map(x => this.appendToResolver(x))
      )

      return finalFix({...data, ...parsedData})

      /*
        forEach(x => this.appendToResolver(x), all)
        forEach(appendToResolver, all) => `this` issue with Ramda

        R.renamePropsWith
      */
    }

    const toSave = await mapAsync(iterator, source)

    const resolverObject = {}
    forEach((x, prop) => {
      const newKey = remove(['{{', '}}'], prop)
      resolverObject[newKey] = x
    })(this.resolver)

    return {toSave, resolver: resolverObject}
  }

  render(input: string, resolver: object) {
    return interpolate(input, resolver)
  }
}
