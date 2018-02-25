import Descriptor from './descriptor';

export default class FunctionDescriptor extends Descriptor {
  constructor(...args) {
    super();
    this.args = args.map(arg => {
      // any value type may be passed instead of an assertion
      // e.g. string, bool, number, etc.
      if (typeof arg !== "object") {
        return {
          match: (val) => val === arg,
          mock: () => arg,
        };
      }
      return arg;
    });
    this.options = [];
    this.examples = [];
  }
  match(args, options) {
    if (args.length !== this.args.length) {
      return false;
    }
    const argsMatch = this.args.filter((arg, i) => arg.match(args[i])).length === args.length;
    const optionsMatch = this.options.filter((option) => options.find(actual => option.match(actual))).length === this.options.length;

    return argsMatch && optionsMatch;
  }
  mock(args, options) {
    let returnValue;

    this.options.forEach(option => {
      const mockResult = option.mock(args, options);

      if (mockResult && mockResult.hasOwnProperty('returnValue')) {
        returnValue = mockResult.returnValue;
      }
    });

    return returnValue;
  }
  addExample(example) {
    this.examples.push(example);
    return this;
  }
  thenCallback(...callbackArgs) {
    let callbackIndex = -1;
    this.args.forEach((arg, i) => arg.isCallback && (callbackIndex = i));
    if (callbackIndex === -1) {
      throw new Error("No callback in arguments list");
    }
    this.options.push({
      match: arg => arg.executeCallback,
      mock: (args, options) => {
        const callbackProvider = options.find(option => option.hasOwnProperty('executeCallback'));
        if (! callbackProvider) {
          throw new Error('Callback value was not specified');
        }
        callbackProvider.executeCallback(args[callbackIndex], args, options);
      },
    });
    return this;
  }
  thenReturn(returnValue) {
    this.options.push({
      returnValue: returnValue,
      match: (arg) => arg.returnValue && returnValue.match(arg.returnValue),
      mock: (args, options) => {
        const userSpecifiedReturnValue = options.find(option => option.hasOwnProperty('returnValue'));
        if (userSpecifiedReturnValue) {
          return userSpecifiedReturnValue;
        }
        return {
          returnValue: returnValue.mock(),
        }
      },
    });
    return this;
  }
}

const fn = (...args) => new FunctionDescriptor(...args);

export { fn }