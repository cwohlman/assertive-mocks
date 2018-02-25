import { describe as describeComponent, fn, obj } from './index';

describe("describeComponent", function () {
  describe("testAllExamples", function () {
    beforeEach(function () {
      this.mock = describeComponent('request');
      this.descriptor = this.mock.addCase(
        fn(obj()).thenReturn(obj())
      );
    })
    it("should run each example", function () {
      let didRunExample = false;
      this.descriptor.addExample((subject) => {
        didRunExample = true;
      });
     
      try {
        this.mock.testAllExamples(() => 1);
      } catch (error) {
        // ignore error
      }
      
      expect(didRunExample).to.be.true;
    });
    it("should not throw if subject is used as described", function () {
      this.descriptor.addExample((subject) => {
        subject({});
      });
     
      this.mock.testAllExamples(() => a => a);
    });
    it("should throw if subject used with different arguments", function () {
      this.descriptor.addExample((subject) => {
        subject();
      });
     
      expect(() => this.mock.testAllExamples(() => a => a)).to.throw(/subject/);
    });
    it("should throw if subject returns a non-matching result", function () {
      this.descriptor.addExample((subject) => {
        subject({});
      });
     
      expect(() => this.mock.testAllExamples(() => a => 1)).to.throw(/subject/);
    });
  });
  describe("makeMock", function () {
    beforeEach(function () {
      this.mock = describeComponent('request');
      this.descriptor = this.mock.addCase(
        fn(obj()).thenReturn(obj())
      );
    });
    it("should return a function", function () {
      const mock = this.mock.makeMock();

      expect(mock).to.be.a('function');
    });
    describe("mocked function", function () {
      it("should return the specified value", function () {
        const mock = this.mock.makeMock().thenReturn({});

        expect(mock({})).to.be.an('object');
      });
      it("should throw when called with invalid arguments", function () {
        const mock = this.mock.makeMock().thenReturn({});

        expect(() => mock()).to.throw();
      });
      it("should throw when called with invalid return value", function () {
        const mock = this.mock.makeMock().thenReturn(1);

        expect(() => mock({})).to.throw();
      });
    });
  });
});
