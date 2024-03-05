export interface Counter {
    [key: string]: number
}

export interface CounterInterface {
    get: (key: string) => number | undefined
    set: (key: string, value: number) => void
}
