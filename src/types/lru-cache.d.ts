declare module 'lru-cache' {
  export interface LRUCacheOptions<K, V> {
    max?: number;
    maxSize?: number;
    sizeCalculation?: (value: V, key: K) => number;
    ttl?: number;
    allowStale?: boolean;
    updateAgeOnGet?: boolean;
    updateAgeOnHas?: boolean;
    dispose?: (value: V, key: K) => void;
    disposeAfter?: (value: V, key: K) => void;
  }

  export class LRUCache<K, V> {
    constructor(options: LRUCacheOptions<K, V>);
    get(key: K): V | undefined;
    set(key: K, value: V): this;
    has(key: K): boolean;
    delete(key: K): boolean;
    clear(): void;
    purgeStale(): boolean;
    size: number;
    keys(): IterableIterator<K>;
    values(): IterableIterator<V>;
    entries(): IterableIterator<[K, V]>;
  }
}
