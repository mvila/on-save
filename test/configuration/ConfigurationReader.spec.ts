import * as path from "path";
import ConfigurationReader from "../../src/configuration/ConfigurationReader";
import { expect } from "chai";

const configFile = file => path.join(__dirname, "configs", file);

describe("The ConfigurationReader", () => {
    const reader = new ConfigurationReader();

    it("can read from a configuration file", () => {
        const config = reader.readConfiguration(configFile("onsave-ok.json"));
        expect(config.commands.length).to.equal(3);
    });

    it("emits an empty configuration for an unknown file", () => {
        expect(() => reader.readConfiguration(configFile("bad-json.json")))
        .to.throw("Savey-Wavey: Error Reading Configuration File");
    });
});
