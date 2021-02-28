import { DbEntity, DbProperties } from "./db-entity";

import { DbQuery } from "./db-query";
import { DbTableColumn } from "./db-table-column";
import { DbTableSchema } from "./db-table-schema";

export class DbTableForeignKeyMap {
    constructor(
        public readonly from: DbTableColumn,
        public readonly to: DbTableColumn
    ) {}

    public invert(): DbTableForeignKeyMap {
        return new DbTableForeignKeyMap(this.to, this.from);
    }
}

export class DbTableForeignKey {
    constructor(
        public readonly name: string,
        public readonly key: DbTableForeignKeyMap[],
        public readonly toTable: DbTableSchema
    ) {}

    toDbQuery(entity: DbEntity): DbQuery {
        const where: DbProperties = {};

        this.key.forEach((key) => {
            const value = entity.data![key.from.name];

            where[key.to.name] = value;
        });

        return new DbQuery(this.toTable.previewColumns, this.toTable, where);
    }
}
