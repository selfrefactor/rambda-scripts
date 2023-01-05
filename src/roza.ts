export type Functor<T, K> = (input: T) => K;
export type Predicate<T> = (input: T) => boolean;
export type PartialRecord<K extends keyof any, T> = {
  [P in K]?: T;
};

export function filter<T, S extends T> (
  fn: (input: T) => input is S
): (array: T[]) => S[];
export function filter<T> (fn: Predicate<T>): (array: T[]) => T[];

export function filter<T> (fn: Predicate<T>){
  return (list: T[]) => list.filter(fn);
}
