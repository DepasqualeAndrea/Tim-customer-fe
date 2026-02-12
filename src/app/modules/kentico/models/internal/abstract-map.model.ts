

export abstract class AbstractMap<Key, Value> extends Map<Key, Value> {

  public static create<Key, Value>(array?:any[]): AbstractMap<Key, Value> {
    const inst = new Map(array);
    inst['__proto__'] = AbstractMap.prototype;
    return inst as AbstractMap<Key, Value>;
  }
}
