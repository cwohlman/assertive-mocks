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
      const descriptor = mocker.descriptors.find(descriptor => descriptor.match(args, mock.options));
      if (! descriptor) {
        throw new Error("No matching descriptor");
      }
      return descriptor.mock(args, mock.options);
    };
    mock.options = [];
    mock.examples = [];
    mock.thenReturn = (value) => {
      // TD: check whether the value matches any descriptor's return value
      mock.options.push({
        returnValue: value,
      });
      return mock;
    };
    mock.thenCallback = (err, result) => {
      mock.options.push({
        executeCallback: (callback) => {
          callback(err, result);
        },
      });
      return mock;
    };
    return mock;
  }
  testAllExamples(subjectMaker) {
    this.descriptors.forEach(descriptor => {
      descriptor.examples.forEach(example => {
        const testcase = {};
        const subject = subjectMaker();
        // TODO: check that subject was used at least once & the last useage matches the descriptor
        example(function (...args) {
          testcase.calledWith = args;
          const result = subject.apply(this, args);
          return testcase.result = result;
        });

        if (! descriptor.match(testcase.calledWith, [{ returnValue: testcase.result }])) {
          throw new Error("subject was not used in accordance with description");
        }
      });
    });
  }
}

const describe = (name) => {
  return new AssertiveMock(name);
};

export { describe };
