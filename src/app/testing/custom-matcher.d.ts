export {};

declare global {
    namespace jasmine {
        interface Matchers<T> {
            toBeRespectively<TItem>(expected: ((arg: TItem) => boolean)[], expectationFailOutput?: any): boolean;

            toOthers<TItem>(expected: ((arg: TItem, others: TItem[]) => boolean)[], expectationFailOutput?: any): boolean;
        }
    }
}
