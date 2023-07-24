import * as R from "https://deno.land/x/rambda/mod.ts";
// import * as Ramda from "https://x.nest.land/ramda@0.28.0/mod.ts";

let a=R.add(1)(2) // => will trigger warning in VSCode
console.log({a})
// Ramda.add(1)('foo') // => will not trigger warning in VSCode
