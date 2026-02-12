export interface KenticoElementConverterInterface<T> {
  convertElement(obj: T): object;
}
