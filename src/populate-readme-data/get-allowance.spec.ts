import { getAllowance } from './get-allowance'

describe('happy', () => {
  ['add', 'adjust', `pipe`].forEach((method) => {
    test((method), () => {
      const result =  getAllowance(method, false)
      expect(
        result
      ).toMatchSnapshot()
    })
  })
})
