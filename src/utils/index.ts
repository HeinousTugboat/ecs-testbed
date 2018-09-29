export * from './vector';

export function invalid<T>(o: T | undefined | null): o is undefined | null {
  return o === undefined || o === null;
}

export function ready(cb: () => void) {
  if (document.readyState !== 'loading') {
    cb();
  } else {
    document.addEventListener('DOMContentLoaded', cb);
  }
}
