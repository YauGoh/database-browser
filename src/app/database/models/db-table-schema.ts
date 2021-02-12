import { DbTableColumn } from "./db-table-column";
import { DbTableForeignKey } from "./db-table-foreign-key";
import { DbTableName } from "./db-table-name";

export class DbTableSchema {
    _foreignKeys: DbTableForeignKey[];

    constructor(
        public readonly name: DbTableName, 
        public readonly primaryKey: DbTableColumn[], 
        public readonly columns: DbTableColumn[]) {
        this._foreignKeys = [];
    } 

    public get foreignKeys(): DbTableForeignKey[] { return this._foreignKeys; }

    public addForeinKey(foreignKey: DbTableForeignKey): DbTableSchema {

        this._foreignKeys = [... this._foreignKeys, foreignKey];

        return this;
    }
}
