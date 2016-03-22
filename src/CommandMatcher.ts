import { ISaveCommand } from "./interfaces";
import * as minimatch from "minimatch";
import * as path from "path";

export default class CommandMatcher {
    /**
     * Determines whether a command applies to a save event on a file
     */
    public isApplicable(command: ISaveCommand, projectPath: string, filePath: string) {
        return minimatch(filePath, command.files);
    }
}
