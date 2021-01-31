// in this file you can append custom step methods to 'I' object

module.exports = function () {
  return actor({
    async seeLocalStorage(key) {
      const found = await this.executeScript(
        (k) => localStorage.getItem(k),
        key
      );
      if (found === null) {
        throw new Error(`Expected null, Found ${found}`);
      }
    },
    async dontSeeLocalStorage(key) {
      const found = await this.executeScript(
        (k) => localStorage.getItem(k),
        key
      );
      if (found !== null) {
        throw new Error(`Expected null, Found ${found}`);
      }
    },
    async seeLocalStorageEquals(key, expected) {
      const found = await this.executeScript(
        (k) => localStorage.getItem(k),
        key
      );
      if (expected !== found) {
        throw new Error(`Expected ${expected}, Found ${found}`);
      }
    },

    async removeLocalStorage(key) {
      await this.executeScript(() => localStorage.removeItem(key));
    },
    async clearLocalStorage() {
      await this.executeScript(() => localStorage.clear());
    },
  });
};
