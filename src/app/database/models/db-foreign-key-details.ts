import { DbTableColumn } from "./db-table-column";
import { DbTableForeignKeyMap } from "./db-table-foreign-key";
import { DbTableName } from "./db-table-name";

export class DbForeignKeyDetails {
    constructor(
        public readonly name: string,
        public readonly from: DbTableName,
        public readonly to: DbTableName,
        public readonly key: DbTableForeignKeyMap[]
    ) {}
}
