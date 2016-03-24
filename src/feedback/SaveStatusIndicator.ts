import {ISimpleResultHandler} from "./interfaces";
const { Disposable } = require("atom");
const STATUS_UNKNOWN = "save-status-unknown";
const STATUS_SUCCESS = "save-status-success";
const STATUS_FAIL = "save-status-failure";

// TODO: LRU-ify this thing
const saveStatusCache = {};

class SaveStatusIndicator extends HTMLElement implements ISimpleResultHandler {
    private activeItemSubscription: AtomCore.Disposable;
    private clickSubscription: AtomCore.Disposable;
    private saveStatusIcon: HTMLSpanElement;
    private clickHandlers: (() => void)[];

    public initialize() {
        this.clickHandlers = [];
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
        this.clickSubscription.dispose();
    }

    public registerOnClickHandler(handler) {
        this.clickHandlers.push(handler);
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
        const icon = document.createElement("span");
        icon.classList.add("icon", "icon-checklist", STATUS_UNKNOWN);
        this.appendChild(icon);
        this.saveStatusIcon = icon;

        const clickHandler = this.onIconClicked.bind(this);
        icon.addEventListener("click", clickHandler);
        this.clickSubscription = new Disposable(() => icon.removeEventListener("click", clickHandler));
    }

    private onIconClicked() {
        this.clickHandlers.forEach(handler => handler());
    }

    private getActiveItem() {
        return atom.workspace.getActivePaneItem();
    }

    private getActiveItemPath() {
        const activeItem = this.getActiveItem();
        if (activeItem) {
            return activeItem && activeItem["getPath"] ? activeItem["getPath"]() : null;
        }
    }
}

const elementType = document["registerElement"]("save-status-indicator", { prototype: SaveStatusIndicator.prototype, extends: "div" });
export default elementType;
