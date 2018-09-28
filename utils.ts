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

export class Vector {
  constructor(public x = 0, public y = 0) { }
}
