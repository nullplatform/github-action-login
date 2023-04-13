const BASE64 = 'base64';
const UTF8 = 'utf8';

class Base64 {

    static encode(string, encoding = UTF8) {
        return Buffer.from(string, encoding).toString(BASE64);
    }

    static decode(string, encoding = UTF8) {
        return Buffer.from(string, BASE64).toString(encoding);
    }
}

module.exports = Base64;
