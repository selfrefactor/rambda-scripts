import {ms} from 'string-fn'

import {build} from '../utils'
import {defaultTo} from 'helpers-fn'
import {importRamdaSpecs} from './import-ramda-specs'
import {runRamdaSpecs} from './run-ramda-specs'
import {runSingleSpec} from './_modules/run-specs'

jest.setTimeout(ms('12 minutes'))
const RUN_ALL = defaultTo('RUN_ALL', false, 'onoff')
const WITH_INITIAL_STEP = defaultTo('WITH_INITIAL_STEP', false, 'onoff')
const METHOD = defaultTo('METHOD', 'modify', 'default')
console.log({RUN_ALL, WITH_INITIAL_STEP, METHOD})

test('run single spec', async () => {
  if (RUN_ALL) return

  await build()
  await importRamdaSpecs(WITH_INITIAL_STEP)
  expect(await runSingleSpec(METHOD)).toBeTruthy()
})

test('run all specs', async () => {
  if (!RUN_ALL) return
  await build()
  await runRamdaSpecs({withInitialStep: WITH_INITIAL_STEP})
})
