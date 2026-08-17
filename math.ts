type TupleOf<N extends number, List extends unknown[] = []> =
    List["length"] extends N ?
    List :
    TupleOf<N, [...List, "⬛"]>

type SizeOf<List extends unknown[]> = List["length"]

type Sum<A extends number, B extends number> = [...TupleOf<A>, ...TupleOf<B>]["length"] & number

type Multiply<A extends number, B extends number, Acc extends number = 0, Result extends unknown[] = []> = 
B extends Acc ? SizeOf<Result> : Multiply<A, B, Sum<Acc, 1>, [...Result, ...TupleOf<A>]>

type Minus<A extends number, B extends number> = TupleOf<A> extends [...TupleOf<B>, ...infer Rest] ? SizeOf<Rest> : never

type Div<A extends number, B extends number, Acc extends number = 0> = TupleOf<A> extends [...TupleOf<B>, ...infer Rest] ? 
Div<SizeOf<Rest>, B, Sum<Acc, 1>>
: Acc

type Mod<A extends number, B extends number, Acc extends number = 0> = TupleOf<A> extends [...TupleOf<B>, ...infer Rest] ? 
Mod<SizeOf<Rest>, B, Sum<Acc, 1>>
: SizeOf<TupleOf<A>>

type isEqual<A extends number, B extends number> = A extends B ? true : false 

type IsGreaterThanOrEqual<A extends number, B extends number> =  Minus<A, B> extends never ? false : true
type IsLessThanOrEqual<A extends number, B extends number> =  Minus<A, B> extends 0 ? true : false

type isWithinInclusiveRange<Target extends number, Range extends { min: number, max: number }> = 
    (IsGreaterThanOrEqual<Target, Range["min"]> & IsLessThanOrEqual<Target, Range["max"]>) extends never ? false : true

type b = 10 extends never ? true : false
type test = isWithinInclusiveRange<5, { min: 0, max: 5 }>