# Consume typings

Post fact manual test

---

{
  "scripts": {
    "start": "npm install --force&&yarn test",
    "test": "tsc --lib esnext,dom consume-typings.ts&&node consume-typings.js"
  },
  "dependencies": {
    "rambda": "file:./../../../rambda/",
    "rambdax": "file:./../../../rambdax/"
  }
}


```
    "rambda": "https://github.com/selfrefactor/rambda#7.0.0-alpha",
```

## Test

type A = Awaited<Promise<string>>;

this is added in 4.5 so this can be used to test this script