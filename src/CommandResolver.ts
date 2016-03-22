/**
 * Resolves Variables into a Command
 */
export default class CommandResolver {
    public resolve(command: string, args = {}) {
        return Object.keys(args).reduce((currentResult, key) => {
          const regExp = new RegExp(`\\$\\{${key}\\}`, 'g');
          return currentResult.replace(regExp, args[key]);
        }, command);
    }
}
//
