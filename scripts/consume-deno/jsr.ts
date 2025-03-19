// import * as R from 'https://deno.land/x/rambda@9.4.1/mod.ts'
// import * as R from 'https://deno.land/x/rambda@9.4.1/mod.ts'
import * as R from "@rambda/rambda";

const rEquals = R.equals(
	{
		a: {b: 1},
  })(
  {
		a: {b: 1},
  }
)
console.log(rEquals, R.add)

// import * as R from 'https://deno.land/x/rambda/mod.ts'
// import * as R from 'https://deno.land/x/rambda@v9.1.0/mod.ts'
