import {getCoveragePath} from './get-coverage-path'

test('spec.ts', () => {
  const [result, fileName] = getCoveragePath(
    'home/sk/',
    'home/sk/foo/bar.spec.ts'
  )
  console.log({result})
})

