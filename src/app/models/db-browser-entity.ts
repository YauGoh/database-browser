import {
    DbBrowser,
    Point,
    Rectangle,
    Size,
    dataRowHeight,
    rowHeight,
    width,
} from "./db-browser";
import { DbEntity, DbProperties, DbValue } from "../database/models/db-entity";

import { DbBrowserForeignKey } from "./db-browser-foreign-key";
import { DbBrowsingService } from "../database/services/db-browsing.service";
import { DbTableName } from "../database/models/db-table-name";

export class DbBrowserProperty {
    constructor(public readonly name: string, public readonly value: DbValue) {}
}

export class DbBrowserEntity extends DbBrowser {
    private _foreignKeys: DbBrowserForeignKey[];
    private _properties: DbBrowserProperty[] | undefined;

    constructor(
        readonly entity: DbEntity,
        private readonly browsingService: DbBrowsingService
    ) {
        super();

        this._foreignKeys = entity.table.foreignKeys.map(
            (fk) => new DbBrowserForeignKey(entity, fk, this.browsingService)
        );
    }

    public get primaryKey(): DbProperties {
        return this.entity.primaryKey;
    }

    public get preview(): DbProperties {
        return this.entity.preview;
    }

    public get foreignKeys(): DbBrowserForeignKey[] {
        return this._foreignKeys;
    }

    public get table(): DbTableName {
        return this.entity.table.name;
    }

    public get properties(): DbBrowserProperty[] {
        if (!this.entity.data) return [];

        if (!this._properties) {
            this._properties = [];

            for (const key in this.entity.data) {
                this._properties.push(
                    new DbBrowserProperty(key, this.entity.data[key])
                );
            }
        }

        return this._properties;
    }

    public getHeaderHeight(): number {
        return rowHeight;
    }

    public getDataHeight(): number {
        return this.properties.length * dataRowHeight;
    }

    public getForeignKeyHeight(): number {
        return this.foreignKeys
            .map((fk) => fk.getRequiredRectangle(new Point(0, 0)).size.height)
            .reduce((sum, v) => sum + v);
    }

    public getRequiredHeght(): number {
        return (
            this.getHeaderHeight() +
            this.getDataHeight() +
            this.getForeignKeyHeight()
        );
    }

    public getRequiredRectangle(start: Point): Rectangle {
        return new Rectangle(start, new Size(width, this.getRequiredHeght()));
    }
}
