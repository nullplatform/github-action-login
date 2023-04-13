const Base64 = require('./base64');
test('throws type error because invalid string', () => {
    expect(() => Base64.encode(100)).toThrow('The first argument must be of type string or an instance of Buffer, ArrayBuffer, or Array or an Array-like Object. Received type number (100)');
});

test('encode "this is a test" string to base 64', () => {
    expect(Base64.encode('this is a test')).toBe('dGhpcyBpcyBhIHRlc3Q=');
});

test('decode "dGhpcyBpcyBhIHRlc3Q=" base 64 to string', () => {
    expect(Base64.decode('dGhpcyBpcyBhIHRlc3Q=')).toBe('this is a test');
});
