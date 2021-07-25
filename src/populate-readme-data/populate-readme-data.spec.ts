import { WITH_RAMBDAX } from '../constants'
import { populateDocsData } from '../populate-docs-data/populate-docs-data'
import { populateReadmeData } from './populate-readme-data'

test('generate final readme file for one of both libraries', async () => {
  await populateDocsData(WITH_RAMBDAX)
  await populateReadmeData(WITH_RAMBDAX, false)
})
