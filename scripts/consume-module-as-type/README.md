# Consume JS while `type=module`

> https://github.com/selfrefactor/rambda/issues/657

Issue is between 7.3.0 and 7.4.0

---
most influential is exports.import

works with 

	"main": "./rambda.js",
	"module": "./rambda.js",
  "exports": {
    ".": {
			"require": "./rambda.js",
			"import": "./dist/rambda.mjs",
			"default": "./rambda.js"
    },
    "./src/": "./src/",
    "./dist/": "./dist/"
  },


no influence without
    "./src/": "./src/",
    "./dist/": "./dist/"

---

to test locally

    "start": "npm install --force&&yarn test",
  "dependencies": {
    "rambda": "file:./../../../rambda/",