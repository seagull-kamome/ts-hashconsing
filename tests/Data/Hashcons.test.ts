/**
 *
 *
 */
import { HC, intern, hash } from '../../src/Data/Hashcons';


describe('Simple hashconsing', () => {

  test('Hashing.', () => {
    expect(hash(1)).toBeDefined();
    expect(hash("abc")).toBeDefined();
    expect(hash({ foo: 'abc', bar: 'def' })).toBeDefined();
    expect(hash([5,4,3,2,1])).toBeDefined();
    expect(hash({ a: 1, b: 'abc', c: [5,6,7] })).toBeDefined();
  });


  test('Intern', () => {
    const x1 = intern({ a: 1, b: 'abc', c: [5,6,7] });
    const x2 = intern({ a: 2, b: 'abc', c: [5,6,7] });
    const x3 = intern({ a: 1, b: 'aba', c: [5,6,7] });
    const x4 = intern({ a: 1, b: 'aba', c: [5,8,7] });

    expect(x1.__hcid).toBe(1);
    expect(x2.__hcid).toBe(2);
    expect(x3.__hcid).toBe(3);
    expect(x4.__hcid).toBe(4);


    const x5 = intern({ a: 1, b: 'abc', d: x1 });
    const x6 = intern({ a: 2, b: 'abc', d: x1 });
    const x7 = intern({ a: 1, b: 'abc', d: x3 });
    const x8 = intern({ a: 1, b: 'abc', d: x4 });

    expect(x5.__hcid).toBe(5);
    expect(x6.__hcid).toBe(6);
    expect(x7.__hcid).toBe(7);
    expect(x8.__hcid).toBe(8);

    const x1_ = intern({ a: 1, b: 'abc', c: [5,6,7] });
    const x2_ = intern({ a: 2, b: 'abc', c: [5,6,7] });
    const x3_ = intern({ a: 1, b: 'aba', c: [5,6,7] });
    const x4_ = intern({ a: 1, b: 'aba', c: [5,8,7] });

    expect(x1_).toBe(x1);
    expect(x2_).toBe(x2);
    expect(x3_).toBe(x3);
    expect(x4_).toBe(x4);


    const x5_ = intern({ a: 1, b: 'abc', d: x1_ });
    const x6_ = intern({ a: 2, b: 'abc', d: x1_ });
    const x7_ = intern({ a: 1, b: 'abc', d: x3_ });
    const x8_ = intern({ a: 1, b: 'abc', d: x4_ });

    expect(x5_).toBe(x5);
    expect(x6_).toBe(x6);
    expect(x7_).toBe(x7);
    expect(x8_).toBe(x8);
  });


  test('Intern does not copy the value.', () => {
    const x = { a: 99, b: 'abc', c: [5,6,7] };
    const y = intern(x);
    expect(y).toBe(x);
    expect(y === x).toBe(true);

    const z = intern({ a: 99, b: 'abc', c: [5,6,7] });
    expect(z).toBe(x);
    expect(z === x).toBe(true);
    expect(z).toBe(y);
    expect(z === y).toBe(true);
  });

});


