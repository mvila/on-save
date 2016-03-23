import * as path from "path";

export default function getCommandArguments(project: string, filePath: string, base = "") {
    const ext = path.extname(filePath);
    const name = path.basename(filePath, ext);
    const dirRoot = base ? path.join(project, base) : project;
    const dir = path.relative(dirRoot, path.join(project, path.dirname(filePath)));
    const absPath = path.join(project, filePath);
    return {
        project, // Project root directory
        path_abs: absPath, // The absolute path of the changed file
        path: filePath, // The path of the changed file relative to the project
        ext, // The file extension
        name, // The filename without the extension
        dir: (dir === "" ? "." : dir), // The directory of the changed file relative to the command base or the project root
    };
}
