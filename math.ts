type TupleOf<N extends number, List extends unknown[] = []> =
    List["length"] extends N ?
    List :
    TupleOf<N, [...List, "⬛"]>

type SizeOf<List extends unknown[]> = List["length"]

type isEqual<A extends number, B extends number> = A extends B ? true : false 

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