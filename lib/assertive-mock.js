export default class AssertiveMock {
  constructor(name) {
    this.name = name;
    this.descriptors = [];
  }
  addCase(descriptor) {
    this.descriptors.push(descriptor);
    return descriptor;
  }
  makeMock() {
    const mocker = this;
    const mock = function (...args) {
      const descriptor = this.descriptors.find(descriptor => descriptor.match(args, mock.options));
      if (! descriptor) {
        throw new Error("No matching descriptor");
      }
      return descriptor.mock(args, mock.options);
    };
    mock.options = [];
    mock.examples = [];
    mock.thenReturn = (value) => {
      mock.options.push({
        returnValue: value,
      });
    };
    mock.thenCallback = (err, result) => {
      mock.options.push({
        executeCallback: (callback) => {
          callback(err, result);
        },
      });
    };
    return mock;
  }
  testAllExamples(subjectMaker) {
    this.descriptors.forEach(descriptor => {
      descriptor.examples.forEach(example => {
        const subject = subjectMaker();
        // TODO: check that subject was used at least once & the last useage matches the descriptor
        example(subject);
      });
    });
  }
}

const describe = (name) => {
  return new AssertiveMock(name);
};

export { describe };
