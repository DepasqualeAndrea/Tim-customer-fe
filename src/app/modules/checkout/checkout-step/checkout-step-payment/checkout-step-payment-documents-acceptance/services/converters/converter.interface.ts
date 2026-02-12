export interface Converter<X, Y> {
    convert(source: X): Y;
}