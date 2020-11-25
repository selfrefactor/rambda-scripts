import { importRamdaSpecs } from './import-ramda-specs'
import { runSpecs } from './_modules/run-specs'
import { writeSummary } from './_modules/write-summary'

export async function runRamdaSpecs(input : Record<string, boolean>){
  const methodsWithSpecs = await importRamdaSpecs(input.withInitialStep)

  await runSpecs(methodsWithSpecs)
  await writeSummary()
}
