type Expect<T extends true> = T

type ToBeEqual<A, B> =
    [A] extends [B]
        ? [B] extends [A] ? true : false
        : false