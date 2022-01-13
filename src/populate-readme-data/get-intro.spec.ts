import {WITH_RAMBDAX} from '../constants'
import {getIntro} from './get-intro'

test('happy', async() => {
  expect(await getIntro(WITH_RAMBDAX)).toMatchSnapshot()
})
