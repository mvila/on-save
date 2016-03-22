import CommandMatcher from "../src/CommandMatcher";
import { expect } from "chai";

describe("The CommandMatcher", () => {
  const matcher = new CommandMatcher();

  it("can determine if a command will apply to a file", () => {
      const result = matcher.isApplicable({
        files: "src/**/*.js",
        command: "",
        base: ""
      }, "/Users/darthtrevino/projects/x", "src/api/thing.js");
      expect(result).to.be.true;
  });
});
