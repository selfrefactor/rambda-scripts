# Consume typings

Post factum manual test

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
