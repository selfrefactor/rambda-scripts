import { omit, path } from "rambdax"

export function finalFix(x: object): object {
  const benchmarkSummary = path('benchmarkInfo.methodSummary', x)
    ? path('benchmarkInfo.methodSummary', x)
    : ''
  if (!benchmarkSummary) return x

  return {
    ...omit('benchmarkInfo', x),
    benchmarkSummary,
  }
}