import CommandResolver from "../src/CommandResolver";;
import { expect } from "chai";

describe("The Command Resolver", () => {
  const resolver = new CommandResolver();

  it("will not alter a command if the arguments are empty", () => {
      expect(resolver.resolve("myCommand", {})).to.equal("myCommand");
      expect(resolver.resolve("myCommand")).to.equal("myCommand");
  });

  it("can merge variables into a command", () => {
      expect(resolver.resolve("${hello}", {hello: "derp"})).to.equal("derp");
      expect(resolver.resolve("test ${sourceFile} ${sourceExt} tset", {
        sourceFile: "input.txt",
        sourceExt: "txt"
      })).to.equal("test input.txt txt tset");
  });
});
