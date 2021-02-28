import {
    DbBrowser,
    Point,
    Rectangle,
    Size,
    previewHeight,
    width,
} from "./db-browser";

import { DbBrowserEntityPreview } from "./db-browser-entity-preview";
import { DbBrowsingService } from "../database/services/db-browsing.service";
import { DbEntity } from "../database/models/db-entity";
import { DbTableForeignKey } from "../database/models/db-table-foreign-key";

export class DbBrowserForeignKey extends DbBrowser {
    private _isExpanded: boolean = false;
    private _isPoupulated: boolean = false;

    private _previews: DbBrowserEntityPreview[];

    constructor(
        readonly source: DbBrowser,
        private readonly _parent: DbEntity,
        readonly foreignKey: DbTableForeignKey,
        private readonly browsingService: DbBrowsingService
    ) {
        super();

        this._previews = [];
    }

    public get isExpanded(): boolean {
        return this._isExpanded;
    }

    public get name(): string {
        return this.foreignKey.name;
    }

    public get previews(): DbBrowserEntityPreview[] {
        return this._previews;
    }

    public getRequiredHeght(): number {
        let height = previewHeight;

        if (this.isExpanded) {
            height =
                height +
                this.previews
                    .map(
                        (p) =>
                            p.getRequiredRectangle(new Point(0, 0)).size.height
                    )
                    .reduce((t, h) => t + h);
        }

        return height;
    }

    public getRequiredRectangle(start: Point): Rectangle {
        return new Rectangle(start, new Size(width, this.getRequiredHeght()));
    }

    public async toggleExpand(): Promise<void> {
        this._isExpanded = !this._isExpanded;

        if (this._isExpanded && !this._isPoupulated) {
            const dbEntities = await this.browsingService.getForeignKeyEntities(
                this._parent,
                this.foreignKey
            );

            this._previews = dbEntities.map(
                (e) =>
                    new DbBrowserEntityPreview(
                        this.source,
                        e,
                        this.browsingService
                    )
            );
            this._isPoupulated = true;
        }
    }
}
