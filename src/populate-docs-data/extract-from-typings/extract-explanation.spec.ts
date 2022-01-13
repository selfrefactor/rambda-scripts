import {extractExplanation} from './extract-explanation'

test('happy', () => {
  expect(extractExplanation(false)).toMatchSnapshot()
})
