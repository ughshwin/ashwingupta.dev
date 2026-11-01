/** Resolve explicit {{path.to.fact}} references without embedding HTML in data. */
export function resolveReferences(value, facts) {
  function resolve(item, ancestry = []) {
    if (typeof item === 'string') return item.replace(/\{\{([\w.-]+)\}\}/g, (_, path) => {
      if (ancestry.includes(path)) throw new Error(`Circular portfolio reference: ${[...ancestry, path].join(' → ')}`);
      const resolved = path.split('.').reduce((record, key) => record && Object.hasOwn(record, key) ? record[key] : undefined, facts);
      if (typeof resolved !== 'string' && typeof resolved !== 'number') throw new Error(`Unknown portfolio reference: ${path}`);
      return resolve(String(resolved), [...ancestry, path]);
    });
    if (Array.isArray(item)) return item.map(child => resolve(child, ancestry));
    if (item && typeof item === 'object') return Object.fromEntries(Object.entries(item).map(([key, child]) => [key, resolve(child, ancestry)]));
    return item;
  }
  return resolve(value);
}
