import {extractExample} from './extract-example'

test('happy', () => {
  expect(extractExample(false)).toMatchSnapshot()
})
