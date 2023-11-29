import {ms} from 'string-fn'
jest.setTimeout(ms('4 minutes'))

import {importRamdaSpecs, replaceImports} from './import-ramda-specs'

const WITH_INITIAL_STEP = true

test('happy', async () => {
  // await replaceImports()
  await importRamdaSpecs(WITH_INITIAL_STEP)
})
