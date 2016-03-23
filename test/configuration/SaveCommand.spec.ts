import SaveCommand from "../../src/configuration/SaveCommand";
import { expect } from "chai";

describe("The CommandMatcher", () => {
  it("will throw an error if constructed incorrectly", () => {
    expect(() => new SaveCommand(undefined, undefined)).to.throw();
    expect(() => new SaveCommand("**", undefined)).to.throw();
    expect(() => new SaveCommand(undefined, "ls")).to.throw();
  });

  it("can determine if a command will apply to a file", () => {
      const command = new SaveCommand("src/**/*.js", "ls");
      expect(command.appliesTo("src/api/thing.js")).to.be.true;
      expect(command.appliesTo("thing.js")).to.be.false;
  });
});
