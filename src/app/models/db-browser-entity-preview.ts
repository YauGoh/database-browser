import {
    DbBrowser,
    Point,
    Rectangle,
    Size,
    previewHeight,
    width,
} from "./db-browser";
import { DbEntity, DbProperties } from "../database/models/db-entity";

import { DbBrowserEntity } from "./db-browser-entity";
import { DbBrowsingService } from "../database/services/db-browsing.service";

export class DbBrowserEntityPreview extends DbBrowser {
    private _isExpanded: boolean = false;
    private _browserEntity: DbBrowserEntity | undefined;

    constructor(
        readonly source: DbBrowser,
        readonly _entity: DbEntity,
        private readonly browsingService: DbBrowsingService
    ) {
        super();
    }

    public get isExpended(): boolean {
        return this._isExpanded;
    }

    public get entity(): DbBrowserEntity | undefined {
        return this._browserEntity;
    }

    public get preview(): DbProperties {
        return this._entity.preview;
    }

    public async toggleExpand(): Promise<void> {
        this._isExpanded = !this._isExpanded;

        if (this._isExpanded && !this._entity.isPopulated) {
            await this.browsingService.populateEntity(this._entity);

            this._browserEntity = new DbBrowserEntity(
                this.source,
                this,
                this._entity,
                this.browsingService
            );
        }
    }

    public getRequiredRectangle(start: Point): Rectangle {
        return new Rectangle(start, new Size(width, previewHeight));
    }
}
