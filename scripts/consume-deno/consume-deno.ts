// import * as Ramda from "https://x.nest.land/ramda@0.27.2/mod.ts";
import * as R from 'https://deno.land/x/rambdax@11.2.2/mod.ts'
// import * as R from 'https://deno.land/x/rambda@9.3.0/mod.ts'
// import * as R from 'https://deno.land/x/rambda@v9.1.0/mod.ts'

// let a=R.add(1)(2) // => will trigger warning in VSCode
// console.log({a})
// Ramda.add(1)('foo') // => will not trigger warning in VSCode
// import * as R from "https://x.nest.land/rambda@8.3.0/mod.ts";

const rEquals = R.equals(
  {
    a: {b: 1},
  },
  {
    a: {b: 1},
  }
)
console.log(rEquals)
