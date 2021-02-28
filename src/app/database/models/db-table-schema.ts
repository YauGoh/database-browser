import { ColumnType, DbTableColumn } from "./db-table-column";

import { DbProperties } from "./db-entity";
import { DbQuery } from "./db-query";
import { DbTableForeignKey } from "./db-table-foreign-key";
import { DbTableName } from "./db-table-name";

export class DbTableSchema {
    _foreignKeys: DbTableForeignKey[];
    _preview: DbTableColumn[] | undefined = undefined;

    constructor(
        public readonly name: DbTableName,
        public readonly primaryKey: DbTableColumn[],
        public readonly columns: DbTableColumn[]
    ) {
        this._foreignKeys = [];
    }

    public get foreignKeys(): DbTableForeignKey[] {
        return this._foreignKeys;
    }

    public get previewColumns(): DbTableColumn[] {
        if (!this._preview) {
            this._preview = [];

            this._preview.push(...this.primaryKey);

            const aNameColumn = this.columns.find(
                (c) =>
                    c.type == ColumnType.STRING &&
                    !this._preview!.find((_) => _.name == c.name)
            );

            if (aNameColumn) this._preview.push(aNameColumn);
        }

        return this._preview;
    }

    public addForeinKey(foreignKey: DbTableForeignKey): DbTableSchema {
        this._foreignKeys = [...this._foreignKeys, foreignKey];

        return this;
    }

    public getPreviewQuery(
        where: DbProperties | undefined = undefined
    ): DbQuery {
        return new DbQuery(this.previewColumns, this, where);
    }
}
