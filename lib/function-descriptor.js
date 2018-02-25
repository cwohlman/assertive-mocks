import Descriptor from './descriptor';

export default class FunctionDescriptor extends Descriptor {
  constructor(...args) {
    super();
    this.args = args;
    this.options = [];
    this.examples = [];
  }
  match(args, options) {
    const argsMatch = this.args.filter((arg, i) => arg.match(args[i])).length === args.length;
    const optionsMatch = this.options.filter((option) => options.find(outer => outer.match(option))).length === options.length;

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
      match: (args, options) => {
        return !! options.find(option => option.hasOwnProperty('callbackValue') && option.matchArgs(callbackArgs, args, options));
      },
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
    });
    return this;
  }
}

const fn = (...args) => new FunctionDescriptor(args);

export { fn }