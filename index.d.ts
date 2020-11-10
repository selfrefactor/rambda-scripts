interface Method{
  rambdaSource: string
}
export function applyHighlighter(methodData: Method): Promise<object>