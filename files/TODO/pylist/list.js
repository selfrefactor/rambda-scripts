const forceThrow = (fn) => input => {
  if(!fn(input)){
    throw new Error(`from force throw with filter "${fn.toString()}" "${input}"`)
  }
  return input
}
const withDefault = (fn, defaultValue, input) => {
  if(!fn(input)){
    return defaultValue
  }
  return Number(input)
}
const isNumber = x => x*1 === Number(x)
const tryNumber = forceThrow(isNumber)

const normalizeSliceInput = x => {
  if(!x.includes(':')){
    return {
      begin: tryNumber(x),
      step: null,
      end: Infinity
    }
  } 
  const [begin, end, step] = x.split(':')

  return {
    begin: withDefault(isNumber, 0, begin),
    end: withDefault(isNumber, Infinity, end),
    step: withDefault(isNumber, 1, step),
  }
}

export class pylist{
  constructor(...args){
    this._ = Array.of(...args)
  }
  get(){
    return this._
  }
  of(...args){
    this._ = Array.of(...args)
  }
  slice(input, maybeStop){
    if(isNumber(input) && isNumber(maybeStop)){
      return Array.prototype.slice.call(this._, input, maybeStop)
    }
    if(isNumber(input)){
      return Array.prototype.slice.call(this._, input)
    }
    const {begin, end, step} = normalizeSliceInput(input)

    return Array.prototype.slice.call(this._, begin, end)
  }
  push(x){
    this._ = [...this._, x]
    return x
  }
}

