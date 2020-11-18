const LINE_LENGTH = 80

import {
  join,
  map,
  piped,
  split,
} from 'rambdax'

 
export function indentRight(str: string, lineLength = LINE_LENGTH): string {
  return piped(
    str,
    split('\n'),
    map(
      (x:string) => {
        if(x.length > lineLength) return x

        return `${ x }${ ' '.repeat(lineLength - x.length) }`
      },
    ),
    join('\n')
  )
}