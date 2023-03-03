import {existsSync, readJson} from 'fs-extra'
import {
  mapAsync,
  match,
  remove,
  forEach,
  replace,
  map,
  interpolate,
  path, piped,
} from 'rambdax'
import {finalFix} from './utils/final-fix'
import {normalizeBenchmark} from './utils/normalize-benchmark'
import {fixBenchmarkSource} from './utils/fix-benchmark-source'
import {indentRight} from './utils/indent-right'
const shiki = require('shiki')
import * as emptyRequiredImport from './assets/theme.json'

const niketaTheme = shiki.loadTheme(`${__dirname}/assets/theme.json`)

const initialResolver = {
  '{{LINE}}': '<span class="line">',
  '{{START}}': '<pre class="shiki" style="background-color: #25252A">',
  '{{END}}': '</span></span></code></pre>',
}

export class ApplyHighlighter {
  codeToHtml: (x: string, language: 'ts' | 'js') => string
  resolver: {
    [key: string]: string,
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
    }, initialResolver)

    return template
  }

  getContent(data: Record<string, string>) {
    return (prop: string, language: 'js' | 'ts') => {
      if (!data[prop]) return ''
      const sourceWithFixedLength = indentRight(data[prop])

      return this.codeToHtml(sourceWithFixedLength, language)
    }
  }

  getBenchmarkSource(data: Record<string, string>) {
    const maybeSource = path<string>('benchmarkInfo.benchmarkContent', data)
    if (!maybeSource) return ''

    // const sourceWithFixedLength = indentRight(maybeSource)

    return this.codeToHtml(fixBenchmarkSource(maybeSource), 'js')
  }

  async apply(source: Record<string, string>[]) {
    const iterator = async(data: Record<string, string>) => {
      const getContentFn = this.getContent(data)

      const all: Record<string, string> = {}
      all.benchmarkSource = this.getBenchmarkSource(data)
      all.rambdaSource = getContentFn('rambdaSource', 'js')
      all.rambdaSpecs = getContentFn('rambdaSpecs', 'js')
      all.failedRamdaSpecs = getContentFn('failedRamdaSpecs', 'js')
      all.allTypings = getContentFn('allTypings', 'ts')
      all.typing = getContentFn('typing', 'ts')
      all.typescriptDefinitionTest = getContentFn(
        'typescriptDefinitionTest',
        'ts'
      )

      const parsedData = map(x => this.appendToResolver(x), all)

      return piped(
          {...data, ...parsedData},
          normalizeBenchmark,
      )
    }

    const toSave = await mapAsync(iterator, source)

    const resolverObject: Record<string, string> = {}
    forEach((x, prop) => {
      const newKey = remove(['{{', '}}'], prop)
      resolverObject[newKey] = x
    }, this.resolver)

    return {toSave, resolver: resolverObject}
  }

  render(input: string, resolver: object) {
    return interpolate(input, resolver)
  }
}

export async function applyHighlighter(
  sourceFilePath: string
): Promise<{toSave: object, resolver: object}> {
  if (!existsSync(sourceFilePath)) throw new Error('file does not exist')
  const source = await readJson(sourceFilePath)

  const ApplyHighlighterInstance = new ApplyHighlighter()
  await ApplyHighlighterInstance.init()
  const {toSave, resolver} = await ApplyHighlighterInstance.apply(source)

  return {toSave, resolver}
}
