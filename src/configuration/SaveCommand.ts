import { ISaveCommand } from "./interfaces";
import * as minimatch from "minimatch";

/**
 * Default implementation of ISaveCommand
 */
export default class SaveCommand implements ISaveCommand {
    constructor(
        public watch: string,
        public command: string,
        public base: string = null) {
        if (!watch) {
            throw new Error("SaveCommand must have valid 'watch' parameter");
        }
        if (!command) {
            throw new Error("SaveCommand must have valid 'command' parameter");
        }
    }

    public appliesTo(file: string): boolean {
        return minimatch(file, this.watch);
    }
}
