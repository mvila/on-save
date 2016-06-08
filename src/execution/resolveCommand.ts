
export default function resolveCommand(command: string, args = {}) {
    return Object.keys(args).reduce((currentResult, key) => {
      const regExp = new RegExp(`\\$\\{${key}\\}`, "g");
      return currentResult.replace(regExp, args[key]);
    }, command);
}
