import {ms} from 'string-fn'

import {build} from '../utils'
import {importRamdaSpecs} from './import-ramda-specs'
import {runRamdaSpecs} from './run-ramda-specs'
import {runSingleSpec} from './_modules/run-specs'

jest.setTimeout(ms('12 minutes'))
const RUN_ALL = false
const WITH_INITIAL_STEP = true

test('run single spec', async() => {
  if (RUN_ALL) return

  await build()
  await importRamdaSpecs(WITH_INITIAL_STEP)
  expect(await runSingleSpec('none')).toBeTruthy()
})

test('run all specs', async() => {
  if (!RUN_ALL) return
  await build()
  await runRamdaSpecs({withInitialStep: WITH_INITIAL_STEP})
})
