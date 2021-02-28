import { Component, Input } from "@angular/core";
import { Link, Rectangle } from "src/app/models/db-browser";

@Component({
    selector: "db-browser-link",
    templateUrl: "./db-browser-link.component.html",
    styleUrls: ["./db-browser-link.component.scss"],
})
export class DbBrowserLinkComponent {
    private _link: Link | undefined;

    constructor() {}

    @Input()
    public set link(value: Link | undefined) {
        this._link = value;
    }
    public get link(): Link | undefined {
        return this._link;
    }

    public get rectangle(): Rectangle | undefined {
        return this._link?.rectangle;
    }
}
