import { compose, lensProp, view } from "ramda"

const quantityLens = lensProp('quantity')
const composedLens = compose(quantityLens)
const result1 = view(quantityLens, {quantity: 5}) // this works
const result2 = view(composedLens, { quantity: 5 })