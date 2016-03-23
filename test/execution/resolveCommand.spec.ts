import resolveCommand from "../../src/execution/resolveCommand";
import { expect } from "chai";

describe("The Command Resolver", () => {
  it("will not alter a command if the arguments are empty", () => {
      expect(resolveCommand("myCommand", {})).to.equal("myCommand");
      expect(resolveCommand("myCommand")).to.equal("myCommand");
  });

  it("can merge variables into a command", () => {
      expect(resolveCommand("${hello}", {hello: "derp"})).to.equal("derp");
      expect(resolveCommand("test ${sourceFile} ${sourceExt} tset", {
        sourceFile: "input.txt",
        sourceExt: "txt"
      })).to.equal("test input.txt txt tset");
  });
});
