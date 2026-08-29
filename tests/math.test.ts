type TupleCreationTests = [
    Expect<ToBeEqual<SizeOf<TupleOf<10>>, 10>>,

    // works after Tail-Call optimization 
    Expect<ToBeEqual<SizeOf<TupleOf<50>>, 50>>,

    // max recursion depth of a Tail-Call Optimized function
    Expect<ToBeEqual<SizeOf<TupleOf<999>>, 999>>,

    // @ts-expect-error Type instantiation is excessively deep and possibly infinite.
    Expect<ToBeEqual<SizeOf<TupleOf<1000>>, 1000>>,
]

type SizeOfTests = Expect<ToBeEqual<SizeOf<[1,2,3]>, 3>> 

type SumTests = [
    Expect<ToBeEqual<Sum<0, 0>, 0>>,
    Expect<ToBeEqual<Sum<1, 1>, 2>>,

    // addition should be commutative, right?
    Expect<ToBeEqual<Sum<4, 5>, Sum<5, 4>>>,

    Expect<ToBeEqual<Sum<10, 10>, 20>>,
    Expect<ToBeEqual<Sum<50, 50>, 100>>,

    Expect<ToBeEqual<Sum<2, 7>, 9>>,

    // @ts-expect-error hits instantiation limits with current tuple based math implementation
    Expect<ToBeEqual<Sum<5000, 5000>, 10000>>,

    // @ts-expect-error tuple based math can't handle negative numbers
    Expect<ToBeEqual<Sum<50, -1>, 49>>,
]

type MulTests = [
    Expect<ToBeEqual<Multiply<1, 0>, 0>>,
    Expect<ToBeEqual<Multiply<0, 1>, 0>>,

    Expect<ToBeEqual<Multiply<1, 1>, 1>>,

    Expect<ToBeEqual<Multiply<2, 4>, 8>>,
    Expect<ToBeEqual<Multiply<4, 2>, 8>>,

    Expect<ToBeEqual<Multiply<0, 0>, 0>>,
    Expect<ToBeEqual<Multiply<3, 3>, 9>>,

    // @ts-expect-error Type produces a tuple type that is too large to represent. ts(2799)
    Expect<ToBeEqual<Multiply<100, 100>, 1000>>
]

type DivTests = [
    Expect<ToBeEqual<Div<10, 2>, 5>>
]

type ModTests = [
    Expect<ToBeEqual<Mod<10, 2>, 0>>,
    Expect<ToBeEqual<Mod<10, 3>, 1>>
]