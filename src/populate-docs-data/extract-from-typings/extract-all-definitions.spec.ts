import { extractAllDefinitions } from './extract-all-definitions'

test('happy', () => {
  expect(extractAllDefinitions(false)).toMatchSnapshot()
})
