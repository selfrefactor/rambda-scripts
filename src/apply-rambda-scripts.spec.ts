import {applyRambdaScripts} from './apply-rambda-scripts'
import {ms} from 'string-fn'

jest.setTimeout(ms('3 minutes'))

const testMode = 'populate:docs'

test('happy', async() => {
  const mode = process.env.RAMBDA_SCRIPTS_MODE
    ? process.env.RAMBDA_SCRIPTS_MODE
    : testMode

  await applyRambdaScripts(mode)
})
