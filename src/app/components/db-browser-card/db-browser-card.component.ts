import { Component, EventEmitter, Input, Output } from "@angular/core";
import { DbBrowser, Rectangle } from "src/app/models/db-browser";

import { DbBrowserEntity } from "src/app/models/db-browser-entity";
import { DbBrowserEntityPreview } from "src/app/models/db-browser-entity-preview";
import { DbBrowserForeignKey } from "src/app/models/db-browser-foreign-key";
import { DbBrowserTable } from "src/app/models/db-browser-table";

@Component({
    selector: "db-browser-card",
    templateUrl: "./db-browser-card.component.html",
    styleUrls: ["./db-browser-card.component.scss"],
})
export class DbBrowserCardComponent {
    private _item: DbBrowser | undefined = undefined;

    constructor() {}

    public get rectangle(): Rectangle | undefined {
        return this._item?.rectangle;
    }

    public get table(): DbBrowserTable | undefined {
        if (this._item instanceof DbBrowserTable)
            return this._item as DbBrowserTable;

        return undefined;
    }

    public get entity(): DbBrowserEntity | undefined {
        if (this._item instanceof DbBrowserEntity)
            return this._item as DbBrowserEntity;

        return undefined;
    }

    public get preview(): DbBrowserEntityPreview | undefined {
        if (this._item instanceof DbBrowserEntityPreview)
            return this._item as DbBrowserEntityPreview;

        return undefined;
    }

    public get foreignKey(): DbBrowserForeignKey | undefined {
        if (this._item instanceof DbBrowserForeignKey)
            return this._item as DbBrowserForeignKey;

        return undefined;
    }

    @Output()
    public requiresLayout: EventEmitter<DbBrowser> = new EventEmitter<DbBrowser>();

    @Input()
    public set item(value: DbBrowser | undefined) {
        this._item = value;
    }
    public get item(): DbBrowser | undefined {
        return this._item;
    }

    public async expandTable(): Promise<void> {
        if (!this.table) return;

        await this.table.toggleExpand();

        this.requiresLayout.emit(this.table);
    }

    public async togglePreviewExpand(): Promise<void> {
        if (!this.preview) return;

        await this.preview.toggleExpand();

        this.requiresLayout.emit(this.preview);
    }

    public async toggleExpandForeignKey(): Promise<void> {
        if (!this.foreignKey) return;

        await this.foreignKey.toggleExpand();

        this.requiresLayout.emit(this.foreignKey);
    }
}
