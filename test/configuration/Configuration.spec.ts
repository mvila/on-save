import Configuration from "../../src/configuration/Configuration";
import SaveCommand from "../../src/configuration/SaveCommand";
import { expect} from "chai";

describe("The Configuration Class", () => {
    it("can be created", () => {
        const emptyConf = new Configuration();
        expect(new Configuration()).to.be.ok;
        expect(emptyConf.commands).to.deep.equal([]);
    });

    it("can determine what commands are applicable to a file", () => {
        const conf = new Configuration([
          new SaveCommand("**/*.js", "ls"),
          new SaveCommand("src/*.js", "ls")
        ]);
        const commands = conf.getCommandsApplicableToFile("src/index.js");
        expect(commands.length).to.equal(2);
    });
});
