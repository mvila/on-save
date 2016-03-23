import getCommandArguments from "../../src/execution/getCommandArguments";
import { expect } from "chai";

describe("getCommandArguments", () => {

  it("can determine command arguments for a file in a project", () => {
      const args = getCommandArguments("/project/domination", "src/api/emitter.js");
      expect(args.project).to.equal("/project/domination");
      expect(args.path_abs).to.equal("/project/domination/src/api/emitter.js");
      expect(args.path).to.equal("src/api/emitter.js");
      expect(args.ext).to.equal(".js");
      expect(args.name).to.equal("emitter");
      expect(args.dir).to.equal("src/api");
  });

  it("can determine command arguments for a file in a project when a base is used", () => {
      const args = getCommandArguments("/project/domination", "src/api/emitter.js", "src");
      expect(args.dir).to.equal("api");
  });

  it("emits a '.' for the dir when the file is at the top-level", () => {
      const args = getCommandArguments("/project/domination", "emitter.js");
      expect(args.dir).to.equal(".");
  });
});
