// var { describe, fn, obj, callback } = require('assertive-mock');

import { describe } from './assertive-mock';
import { fn } from './function-descriptor';
import { obj } from './assertions';

// create a mock by describing the request module
const mock = describe('request');

mock.addCase(
  fn(obj()).thenReturn(obj())
)
.addExample((subject) => {
  const input = {};
  console.log(subject(input));
  if (subject(input) !== input) {
    throw new Error();
  }
});

mock.testAllExamples(() => a => a);
try {
  mock.testAllExamples(() => a => 0);
} catch (e) {
  console.log('expected to fail! :)');
}

export { mock };