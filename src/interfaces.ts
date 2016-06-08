export interface IInitializable {
    initialize();
}

export interface IDisposable {
    dispose();
}

export interface IActiveItemListener extends IInitializable, IDisposable {
  subscribe(handler: (file: string) => void);
  activeItem: AtomCore.IPane;
  activeItemPath: string;
}
