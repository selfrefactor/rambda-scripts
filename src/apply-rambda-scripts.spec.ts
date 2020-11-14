import {applyRambdaScripts} from './apply-rambda-scripts'
import { ms } from 'string-fn'

jest.setTimeout(ms('3 minutes'))

test('happy', async () => {
    const mode = 'toolbelt'
    await applyRambdaScripts(mode)
})