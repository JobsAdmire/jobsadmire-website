/** Node ≥23 defines a stub `localStorage` global, and vitest's jsdom environment therefore
 *  leaves jsdom's real `Storage` uncopied — `localStorage.getItem` is not a function under the
 *  Node this repo is run with. Tests that care about storage bring their own, so they assert
 *  what our code does with the Storage API rather than what the host happens to provide. */
export function memoryStorage(): Storage {
  const map = new Map<string, string>();
  return {
    get length() {
      return map.size;
    },
    clear: () => map.clear(),
    getItem: (k: string) => map.get(k) ?? null,
    key: (i: number) => [...map.keys()][i] ?? null,
    removeItem: (k: string) => void map.delete(k),
    setItem: (k: string, v: string) => void map.set(k, v),
  };
}
