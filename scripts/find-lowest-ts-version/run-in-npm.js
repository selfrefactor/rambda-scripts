// https://www.npmjs.com/package/typescript

const stopVersion = `4.0.8`
let passedStopVersion = false

const list = Array.from($$(`.code`))
.map(x => x.textContent.replace(/\./g), '')
.filter(x => {
  if(x === stopVersion){
    passedStopVersion = true
    return false
  }
  if(passedStopVersion) return false
  return !x.includes('-') && !x.includes('dev')
}).sort()

console.log([...list, stopVersion])
