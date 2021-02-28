import {
    DbBrowser,
    Point,
    Rectangle,
    Size,
    rowHeight,
    width,
} from "./db-browser";

import { DbBrowserEntityPreview } from "./db-browser-entity-preview";
import { DbBrowsingService } from "../database/services/db-browsing.service";
import { DbTableName } from "../database/models/db-table-name";
import { DbTableSchema } from "../database/models/db-table-schema";

export class DbBrowserTable extends DbBrowser {
    private _isExpanded: boolean = false;
    private _isPopulated: boolean = false;

    private _previews: DbBrowserEntityPreview[] = [];

    constructor(
        readonly table: DbTableSchema,
        private readonly browsingService: DbBrowsingService
    ) {
        super();
    }

    public get name(): DbTableName {
        return this.table.name;
    }

    public get isExpanded(): boolean {
        return this._isExpanded;
    }

    public get previews(): DbBrowserEntityPreview[] {
        return this._previews;
    }

    public async toggleExpand(): Promise<void> {
        this._isExpanded = !this._isExpanded;

        if (this._isExpanded && !this._isPopulated) {
            const dbEntities = await this.browsingService.getTablePreview(
                this.table
            );

            this._previews = dbEntities.map(
                (e) => new DbBrowserEntityPreview(this, e, this.browsingService)
            );
            this._isPopulated = true;
        }
    }

    public getRequiredRectangle(start: Point): Rectangle {
        let height = rowHeight;

        if (this.isExpanded) {
            height += this.previews
                .map((p) => p.getRequiredRectangle(new Point(0, 0)).size.height)
                .reduce((t, h) => t + h);
        }

        return new Rectangle(start, new Size(width, height));
    }
}
