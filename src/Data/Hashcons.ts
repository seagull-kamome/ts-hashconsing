/**
 * @file fccore/src/Hashcons.ts
 * @brief Implimentation of Hashconsing algorhythm for TypeScript.
 *
 * Copyright 2020, HATTORI, Hiroki
 * All rights reserved.
 *
 */


let lastId = 0;
let store = new Map<number, object[]>();
const PRIM = 1097;
export type HC<T extends object> = { __hcid: number } & T;


export function hash(x:any, lvl:number=1): number {
  // FIXME: I need good hash.
  switch (typeof x) {
    case 'undefined': return 13;
    case 'number': return x;
    case 'string':
      {
        let n = 0;
        for (let i = 0; i < x.length; ++i) n += x.charCodeAt(i) * (i + 1);
        return n * lvl;
      }
    case 'boolean': return x?(lvl+1):lvl;
    case 'object':
      if (x === null) return 11;
      return (Array.isArray(x))? x.reduce(((acc:number, y:any) => acc + hash(y, lvl + PRIM)), 0)
        : ('__hcid' in x)? x.__hcid * lvl
        : Object.values(x).reduce(((acc:number, y:any) => acc + hash(y, lvl * PRIM)), 0);
    default:
      console.log('fccore/src/Hashcons.ts: hash(): invalid member.'); return 0; } }


function compare(lhs:any, rhs:any) : boolean {
  return Object.entries(lhs).every(([k, v]: [string, any]) =>
    (k in rhs
      && (v === rhs[k]
        || (typeof v === 'object' && typeof rhs[k] === 'object'
          && v !== null && rhs[k] !== null
          && ((!!v.__hcid && v.__hcid == rhs[k].__hcid) || compare(v, rhs[k])) ))) ); }


export function intern<T extends object>(x: T) : HC<T> {
  delete (x as any)['__hcid'];

  const hk = hash(x);

  let ys = store.get(hk);
  if (ys === undefined) {
    (x as any).__hcid = ++lastId;
    store.set(hk, [x]);
    return x as HC<T>;
  } else {
    let y = ys.find((y:object) => compare(x, y));
    if (y === undefined) {
      (x as any).__hcid = ++lastId;
      ys.push(x);
      return x as HC<T>;
    }
    return y as HC<T>;
  }
}

// : vim ts=8 sw=2 tw=80 noexpandtab :
