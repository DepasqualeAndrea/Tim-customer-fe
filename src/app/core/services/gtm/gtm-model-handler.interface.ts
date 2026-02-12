export interface GtmModelHandler {
    overwrite(obj: { [key: string]: any; }, onlyNative?: boolean): void;
    add(obj: { [key: string]: any; }): void;
    reset(): void;
}