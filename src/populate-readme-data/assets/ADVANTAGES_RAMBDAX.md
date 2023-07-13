### TypeScript included

TypeScript definitions are included in the library, in comparison to **Ramda**, where you need to additionally install `@types/ramda`.

Still, you need to be aware that functional programming features in `TypeScript` are in development, which means that using **R.compose/R.pipe** can be problematic.

{{rambdaTypeScriptInfo}}

### Dot notation for `R.path`, `R.paths`, `R.assocPath` and `R.lensPath`

Standard usage of `R.path` is `R.path(['a', 'b'], {a: {b: 1} })`.

In **Rambda** you have the choice to use dot notation(which is arguably more readable):

```
R.path('a.b', {a: {b: 1} })
```

### Comma notation for `R.pick` and `R.omit`

Similar to dot notation, but the separator is comma(`,`) instead of dot(`.`).

```
R.pick('a,b', {a: 1 , b: 2, c: 3} })
// No space allowed between properties
```

### Extendable with Ramda community projects

`Rambdax` implements some methods from `Ramda` community projects, such as `R.lensSatisfies`, `R.lensEq` and `R.viewOr`.

### Alternative TS definitions

Alternative TS definitions are available as `rambdax/immutable`. These are Rambdax definitions linted with ESLint `functional/prefer-readonly-type` plugin.
