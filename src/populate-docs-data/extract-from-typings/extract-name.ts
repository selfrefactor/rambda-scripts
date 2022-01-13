import {match, remove, trim} from 'rambdax'

export function extractName(rawInfo: string) {
  const [maybeName] = match(/Method:.+/)(rawInfo)
  if (!maybeName) return ''

  return trim(remove('Method:', maybeName))
}
