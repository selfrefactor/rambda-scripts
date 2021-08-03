## Separate README for docsify

## Rambdax + RxJS 

simulate rxjs api and benchmark it

## publish rambdax to deno(remove on next rambdax release)

## Add lint staged

## Dictionary - type vs interface

https://github.com/selfrefactor/rambda/issues/459#issuecomment-771519978

## R.resolve

https://github.com/verydanny/vcslack/blob/master/src/api.ts

## lastIndexOf

## update repl

## isValid with functions

only arrow function works

```
ok(repos)(fn)  
  // ok(repos)(x => {
  //     console.log({x})
  //   })
```

also not possible is array of function schema

```
ok(repos)([x => {
      console.log({x})
    }])
```

## Update https://github.com/selfrefactor/rambda-tree-shaking

## identical-spec.ts

    in curried version Typescript correctly catch errors
    but it doesn't do so in the standart definition
    
    identical({a:1},{b:2})
    identical({a:1})({b:2})

## typings of last and head

```
const parse = pipe(split('.'), head) is wrong
but
const parse = pipe(split('.'), last) is correct
```

## Deno info

To use directly in [Deno](https://deno.land):
```javascript
import * as R from "https://deno.land/x/rambda/rambda.js";
```

## Other

create pipeline for `rambda-docs` typings file
---

Methods to add:  

- whereAny
- uniqBy
- propSatisfies
- pickBy
- pathSatisfies
- gte
- mapObjIndexed(types from @types/ramda | added but types are not from there)

https://github.com/smartprocure/futil-js#differentlast
https://github.com/smartprocure/futil-js#whentruthy
findApply
compactMap
compactJoin
flattenObject
simpleDiff
highlight
on
off
includeLens?
---

## Can postpone

### Alternative pipeAsync Typings

### deprecate R.renameProps in favour of https://jmlweb.github.io/ramdu/global.html#evolveKeys

### Maybe https://github.com/13d-io/maybe-just-maybe

### Faster isObject?

https://github.com/neotan/simda/blob/master/src/internal/_isObject.js

---

https://github.com/MartinPavlik/ramda-async/blob/master/index.ts

- R.mapKeys (name inspiration from https://github.com/AlexGalays/spacelift#objectmapvalues)

fetch contributors github's avatars

Add explanation to missing Ramda methods

Add R.mapToList which takes object and returns a list

R.renamePropsWith

Use new `Promise.allSettled`

Add marker/category for Rambdax methods that doesn't belong to Rambda

repl needs `const result =` and not all methods are correct

search for TODO

use .toThrowErrorMatchingInlineSnapshot

R.map sanity check is different than R.filter - fixable with global change of wrong inputs

## Holder

```
test('happy', () => {https://github.com/MartinPavlik/ramda-async/blob/master/index.ts
  class Foo{
    constructor(){
      this.obj = {}
    }
    foo(x, prop){
      this.obj[prop] = x
    }
    bar(){
      const hash = {a: 1, b:2}
      forEach(this.foo, hash)
      console.log(this.obj)
    }
  }
  const foo = new Foo()
  foo.bar()
})
```

https://github.com/DefinitelyTyped/DefinitelyTyped/commit/182dac81b18d1172f8783310a4e40301f3888e69#diff-4f74803fa83a81e47cb17a7d8a4e46a7e451f4d9e5ce2f1bd7a70a72d91f4bc1
