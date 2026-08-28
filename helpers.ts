type Includes<List extends unknown[], Target extends unknown> =
    List extends [infer Head, ...infer Rest] ?
        Head extends Target ? Head : Includes<Rest, Target>
    : 'Item not included'

type FilterOut<List extends unknown[], Condition extends unknown, Result extends unknown[] = []> =
    List extends [infer Head, ...infer Rest] ?
        Head extends Condition ?
            FilterOut<Rest, Condition, [...Result]>
        : FilterOut<Rest, Condition, [Head, ...Result]>
    : Result

type Reverse<List extends unknown, Result extends unknown[] = []> =
    List extends string ?
        List extends `${infer Head}${infer Rest}` ?
            Reverse<Rest, [Head, ...Result]>
        : Join<Result>
    : List extends [infer Head, ...infer Rest] ?
        Reverse<Rest, [Head, ...Result]>
    : Result

type Join<List extends unknown[], Result extends string = ""> =
    List extends [infer Head extends string, ...infer Rest] ?
        Join<Rest, `${Result}${Head}`>
    : Result

type Mirror<S extends string> =
    S extends `${infer A extends string}\n${infer B extends string}` ?
        Reverse<`${B}\n${A}`>
    : S
