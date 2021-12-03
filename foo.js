const Benchmark = require("benchmark");
const Ra = require("ramda");
const Rb = require("rambda");


const input = [1, 2, 3, 4]
const fns = [val => val + 1, val => val.length]

var suite = new Benchmark.Suite();

suite
  .add("Ramda compose", function () {
    Ra.compose(...fns)(input)
  })
  .add("RamBda compose", function () {
    Rb.compose(...fns)(input)
  })
  .on("cycle", function (event) {
    console.log(String(event.target));
  })
  .on("complete", function () {
    console.log("Fastest is ", this.filter("fastest").map("name"));
  })
  // run async
  .run({ async: true });
