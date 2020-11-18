import { indentRight } from "./indent-right";

test("R.add", () => {
  expect(indentRight(`export function add(a, b){                                                      
      if (arguments.length === 1) return _b => add(a, _b)                           
                                                                                    
      return Number(a) + Number(b)                                                  
    }`)).toMatchInlineSnapshot(`
    "export function add(a, b){                                                      
      if (arguments.length === 1) return _b => add(a, _b)                           
                                                                                    
      return Number(a) + Number(b)                                                  
    }                                                                               "
  `);
});
