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


function hash(x:any, lvl:number=1): number {
  // FIXME: I need good hash.
  switch (typeof x) {
    case 'number': return x;
    case 'string':
      {
        let n = 0;
        for (let i = 0; i < x.length; ++i) n += x.charCodeAt(i) * (i + 1);
        return n * lvl;
      }
    case 'boolean': return x?(lvl+1):lvl;
    case 'object':
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

  /*
console.log(hash(1));
console.log(hash("abc"));
console.log(hash({ foo: 'abc', bar: 'def' }));
console.log(hash([5,4,3,2,1]));
console.log(hash({ a: 1, b: 'abc', c: [5,6,7] }));


const x1 = intern({ a: 1, b: 'abc', c: [5,6,7] });
const x2 = intern({ a: 2, b: 'abc', c: [5,6,7] });
const x3 = intern({ a: 1, b: 'aba', c: [5,6,7] });
const x4 = intern({ a: 1, b: 'aba', c: [5,8,7] });

console.log(x1);
console.log(x2);
console.log(x3);
console.log(x4);


const x5 = intern({ a: 1, b: 'abc', d: x1 });
const x6 = intern({ a: 2, b: 'abc', d: x1 });
const x7 = intern({ a: 1, b: 'abc', d: x3 });
const x8 = intern({ a: 1, b: 'abc', d: x4 });

console.log(x5);
console.log(x6);
console.log(x7);
console.log(x8);


const x1_ = intern({ a: 1, b: 'abc', c: [5,6,7] });
const x2_ = intern({ a: 2, b: 'abc', c: [5,6,7] });
const x3_ = intern({ a: 1, b: 'aba', c: [5,6,7] });
const x4_ = intern({ a: 1, b: 'aba', c: [5,8,7] });

console.log(x1_ === x1);
console.log(x2_ === x2);
console.log(x3_ === x3);
console.log(x4_ === x4);



const x5_ = intern({ a: 1, b: 'abc', d: x1_ });
const x6_ = intern({ a: 2, b: 'abc', d: x1_ });
const x7_ = intern({ a: 1, b: 'abc', d: x3_ });
const x8_ = intern({ a: 1, b: 'abc', d: x4_ });

console.log(x5_ === x5);
console.log(x6_ === x6);
console.log(x7_ === x7);
console.log(x8_ === x8);


console.log(store);
   */

// : vim ts=8 sw=2 tw=80 noexpandtab :
