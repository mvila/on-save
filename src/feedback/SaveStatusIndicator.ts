import {ISimpleResultHandler} from "./interfaces";

const STATUS_UNKNOWN = "save-status-unknown";
const STATUS_SUCCESS = "save-status-unknown";
const STATUS_FAIL = "save-status-unknown";

// TODO: LRU-ify this thing
const saveStatusCache = {};

class SaveStatusIndicator extends HTMLElement implements ISimpleResultHandler {
    private activeItemSubscription: AtomCore.Disposable;
    private saveStatusIcon: HTMLSpanElement;

    public initialize() {
        this.classList.add("save-status-indicator");
        this.createSaveStatusIcon();
        this.activeItemSubscription = atom.workspace.onDidChangeActivePaneItem(this.onActiveItemChanged.bind(this));
        this.onActiveItemChanged();
    }

    public onSuccess(file: string) {
        saveStatusCache[file] = true;
        if (file === this.getActiveItemPath()) {
            this.saveStatusIcon.classList.remove(STATUS_UNKNOWN, STATUS_FAIL);
            this.saveStatusIcon.classList.add(STATUS_SUCCESS);
        }
    }

    public onFailure(file: string) {
        saveStatusCache[file] = false;
        if (file === this.getActiveItemPath()) {
            this.saveStatusIcon.classList.remove(STATUS_UNKNOWN, STATUS_SUCCESS);
            this.saveStatusIcon.classList.add(STATUS_FAIL);
        }
    }

    public destroy() {
        this.activeItemSubscription.dispose();
    }

    private onActiveItemChanged() {
        const file = this.getActiveItemPath();
        this.saveStatusIcon.classList.remove(STATUS_FAIL, STATUS_SUCCESS, STATUS_UNKNOWN);
        if (!saveStatusCache.hasOwnProperty(file)) {
          this.saveStatusIcon.classList.add(STATUS_UNKNOWN);
        } else if (saveStatusCache[file]) {
          this.saveStatusIcon.classList.add(STATUS_SUCCESS);
        } else {
          this.saveStatusIcon.classList.add(STATUS_FAIL);
        }
    }

    private createSaveStatusIcon() {
        const area = document.createElement("div");
        area.classList.add("save-status", "inline-block");
        this.appendChild(area);

        const icon = document.createElement("span");
        icon.classList.add("icon", "icon-check", STATUS_UNKNOWN);
        area.appendChild(icon);
        this.saveStatusIcon = icon;
    }

    private getActiveItem() {
        return atom.workspace.getActivePaneItem();
    }

    private getActiveItemPath() {
        const activeItem = this.getActiveItem();
        return activeItem && activeItem["getPath"] ? activeItem["getPath"]() : null;
    }
}

const elementType = document["registerElement"]("save-status-indicator", { prototype: SaveStatusIndicator.prototype, extends: "div" });
export default elementType;
