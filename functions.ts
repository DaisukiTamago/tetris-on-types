interface HighOrderFunction {
    input: unknown
    output: unknown
}

type Call<Fn extends HighOrderFunction, Arg> = (Fn & { input: Arg })["output"]

type Transform<Fn extends HighOrderFunction, List extends unknown[]> = List extends [infer Head, ...infer Rest] ? 
    [Call<Fn, Head>, ...Transform<Fn, Rest>]
    : []