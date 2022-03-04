## R.none

why ramda testing missed it

## R.equalsProps

R.equalsProps(a,b,properties)

## R.merge

is removed

## R.contains

R.contains({a:1}, {a:1, b:2}) => true

## 0.28

https://ramdajs.com/docs/#collectBy

## Deno import documentation and publish script

- publish rambdax to deno(remove on next rambdax release)

## Test internal curry

check foo against foo with internal curry

## Dictionary - type vs interface

https://github.com/selfrefactor/rambda/issues/459#issuecomment-771519978

## R.resolve

https://github.com/verydanny/vcslack/blob/master/src/api.ts

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

## Methods to add:

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

add avatars to contributors section

Add explanation to missing Ramda methods

Add R.mapToList which takes object and returns a list

R.renamePropsWith

Use new `Promise.allSettled`

Add category in the new docs site for Rambdax methods that doesn't belong to Rambda

repl needs `const result =` and not all methods are correct

search for TODO

use .toThrowErrorMatchingInlineSnapshot

R.map sanity check is different than R.filter - fixable with global change of wrong inputs

```
https://github.com/MartinPavlik/ramda-async/blob/master/index.ts
test('happy', () => {
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
