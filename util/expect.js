module.exports = promise => ({
  toThrow: async reason => {
    try {
      await promise;
    } catch (error) {
      assert.equal(
        error.reason, reason,
        `Expected to throw "${reason}"" but threw "${error.reason}"" instead`
      );
      return;
    }

    assert.fail(`Expected to throw "${reason}" but didn't`);
  }
});