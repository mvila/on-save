const { Disposable } = require("atom");
import { IInitializable } from "./interfaces";

export default class ActiveItemListener implements IInitializable {
    private _activeItemSubscription: AtomCore.Disposable;
    private _listeners: ((file: string) => void)[] = [];

    public initialize() {
        this._activeItemSubscription = atom.workspace.onDidChangeActivePaneItem(this.onActiveItemChanged.bind(this));
        this.onActiveItemChanged();
    }

    public subscribe(h) {
        this._listeners.push(h);
    }

    private onActiveItemChanged() {
        const file = this.activeItemPath;
        this._listeners.forEach(l => l(file));
    }

    public dispose() {
        this._activeItemSubscription.dispose();
    }

    public get activeItem() {
        return atom.workspace.getActivePaneItem();
    }

    public get activeItemPath() {
        const activeItem = this.activeItem;
        if (activeItem) {
            return activeItem && activeItem["getPath"] ? activeItem["getPath"]() : null;
        } else {
          return null;
        }
    }
}
