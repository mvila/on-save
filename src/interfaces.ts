/**
 * Represents a single save command in the on-save configuration.
 */
export interface ISaveCommand {
  /**
   The glob containing the files to watch.
   */
  files: string;

  /**
  The command to execute when files change.
  */
  command: string;
}

/**
 * TODO: Remove when Atom's typings get better
 */
export interface ICompositeDisposable {
  add(any);
  dispose();
}
