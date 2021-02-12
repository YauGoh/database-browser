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
        public readonly toTable: DbTableSchema) {
    }
}
