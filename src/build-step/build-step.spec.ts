import { ms } from 'string-fn'

import { buildStep } from './build-step'

jest.setTimeout(ms('30 seconds'))

test('happy', async () => {
  const withRambdax = false
  await buildStep(withRambdax)
})
