import { compose, lensProp, view } from "rambda"
import * as R from 'ramda'

interface Input {
  quantity: number
}

const quantityLensxxx = R.lensProp<Input, 'quantity'>('quantity')
const composedLensxxx = R.compose(quantityLensxxx)
const result1xxx = R.view(quantityLensxxx, { quantity: 5 })
const result2xxx = R.view(composedLensxxx, { quantity: 5 })


const testObject: Input = {
  quantity: 5,
}
const quantityLens = lensProp('quantity')
const composedLens = compose(quantityLens)

const result = view<Input, number>(quantityLens, testObject)
const result2 = view<Input, number>(composedLens, testObject)


// const quantityLens = lensProp('quantity')
// const composedLens = compose(quantityLens)
// const result1 = view(quantityLens, {quantity: 5}) // this works
// const result2 = view(composedLens, { quantity: 5 })