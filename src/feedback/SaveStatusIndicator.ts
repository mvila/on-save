import {ISimpleResultHandler} from "./interfaces";
import { IActiveItemListener } from "../interfaces";
const { Disposable } = require("atom");
const STATUS_UNKNOWN = "save-status-unknown";
const STATUS_SUCCESS = "save-status-success";
const STATUS_FAIL = "save-status-failure";

// TODO: LRU-ify this thing
const saveStatusCache = {};

class SaveStatusIndicator extends HTMLElement implements ISimpleResultHandler {
    public activeItemListener: IActiveItemListener;
    private clickSubscription: AtomCore.Disposable;
    private saveStatusIcon: HTMLSpanElement;
    private clickHandlers: (() => void)[];

    public initialize() {
        this.clickHandlers = [];
        this.classList.add("save-status-indicator");
        this.createSaveStatusIcon();
        this.activeItemListener.subscribe(this.onActiveItemChanged.bind(this));
    }

    public onSuccess(file: string) {
        saveStatusCache[file] = true;
        if (file === this.activeItemPath) {
            this.saveStatusIcon.classList.remove(STATUS_UNKNOWN, STATUS_FAIL);
            this.saveStatusIcon.classList.add(STATUS_SUCCESS);
        }
    }

    public onFailure(file: string) {
        saveStatusCache[file] = false;
        if (file === this.activeItemPath) {
            this.saveStatusIcon.classList.remove(STATUS_UNKNOWN, STATUS_SUCCESS);
            this.saveStatusIcon.classList.add(STATUS_FAIL);
        }
    }

    public destroy() {
        this.clickSubscription.dispose();
    }

    public registerOnClickHandler(handler) {
        this.clickHandlers.push(handler);
    }

    private get activeItemPath(): string {
        return this.activeItemListener ? this.activeItemListener.activeItemPath : null;
    }

    private onActiveItemChanged(file) {
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
}

const elementType = document["registerElement"]("save-status-indicator", { prototype: SaveStatusIndicator.prototype, extends: "div" });
export default elementType;
