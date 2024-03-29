const process = require('process');
const cp = require('child_process');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config();

test('test runs correctly for valid access token', () => {
  const ip = path.join(__dirname, 'index.js');
  try {
    const result = cp.execSync(`node ${ip}`, { env: process.env }).toString();
    expect(result).toContain('NULLPLATFORM_ACCESS_TOKEN');
  } catch (err) {
    expect.fail(err.message);
  }
});

test('test fails for invalid access token', () => {
  process.env['INPUT_API-KEY'] = '123456';
  const ip = path.join(__dirname, 'index.js');
  expect(() => cp.execSync(`node ${ip}`, { env: process.env })).toThrowError(
    /Command failed/,
  );
});

test('test fails for missing api key', () => {
  process.env['INPUT_API-KEY'] = undefined;
  const ip = path.join(__dirname, 'index.js');
  expect(() => cp.execSync(`node ${ip}`, { env: process.env })).toThrowError(
    /Command failed/,
  );
});
