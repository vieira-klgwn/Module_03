const { validateSearchInput } = require('/tmp/validator-test/utils/validators');

const cases = [
  ['', false, 'Please enter a word'],
  ['      ', false, 'Please enter a valid word'],
  ['12345', false, 'Only alphabetic characters are allowed'],
  ['@#$%^&*', false, 'Please enter a valid English word'],
  ['hello123@', false, 'Please enter a valid English word'],
  ['abc@#', false, 'Please enter a valid English word'],
  ['hello world', false, 'Please enter a single word'],
  ['     apple     ', true],
  ['APPLE', true],
  ['a', true],
  ['I', true],
  ["can't", true],
  ['mother-in-law', true],
];

let failed = 0;

for (const [input, expectValid, msg] of cases) {
  const result = validateSearchInput(input);
  const ok =
    result.valid === expectValid && (!msg || result.message === msg);
  console.log(ok ? 'PASS' : 'FAIL', JSON.stringify(input), result);
  if (!ok) failed += 1;
}

const longResult = validateSearchInput('a'.repeat(46));
const longOk =
  longResult.valid === false && longResult.message === 'Word is too long';
console.log(longOk ? 'PASS' : 'FAIL', 'long word', longResult);
if (!longOk) failed += 1;

console.log(failed === 0 ? '\nALL PASSED' : `\n${failed} FAILED`);
process.exit(failed > 0 ? 1 : 0);
