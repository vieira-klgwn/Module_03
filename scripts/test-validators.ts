import { validateSearchInput } from '../src/utils/validators';

const cases: Array<{ input: string; expectValid: boolean; expectMessage?: string }> = [
  { input: '', expectValid: false, expectMessage: 'Please enter a word' },
  { input: '      ', expectValid: false, expectMessage: 'Please enter a valid word' },
  { input: '12345', expectValid: false, expectMessage: 'Only alphabetic characters are allowed' },
  { input: '@#$%^&*', expectValid: false, expectMessage: 'Please enter a valid English word' },
  { input: 'hello123@', expectValid: false, expectMessage: 'Please enter a valid English word' },
  { input: 'abc@#', expectValid: false, expectMessage: 'Please enter a valid English word' },
  { input: 'hello world', expectValid: false, expectMessage: 'Please enter a single word' },
  { input: '     apple     ', expectValid: true, expectMessage: undefined },
  { input: 'APPLE', expectValid: true, expectMessage: undefined },
  { input: 'a', expectValid: true },
  { input: 'I', expectValid: true },
  { input: "can't", expectValid: true },
  { input: 'mother-in-law', expectValid: true },
  { input: 'a'.repeat(46), expectValid: false, expectMessage: 'Word is too long' },
];

let passed = 0;
let failed = 0;

for (const testCase of cases) {
  const result = validateSearchInput(testCase.input);
  const ok =
    result.valid === testCase.expectValid &&
    (testCase.expectMessage === undefined || result.message === testCase.expectMessage) &&
    (testCase.expectValid ? result.normalizedWord === testCase.input.trim().toLowerCase() : true);

  if (ok) {
    passed += 1;
    console.log(`PASS: "${testCase.input}"`);
  } else {
    failed += 1;
    console.error(`FAIL: "${testCase.input}"`, result);
  }
}

console.log(`\n${passed} passed, ${failed} failed`);
process.exit(failed > 0 ? 1 : 0);
