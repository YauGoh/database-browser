import { DbConfig } from "../models/db-config";
import { DbForeignKeyDetails } from "../models/db-foreign-key-details";
import { DbTableForeignKey } from "../models/db-table-foreign-key";
import { DbTableName } from "../models/db-table-name";
import { DbTableSchema } from "../models/db-table-schema";
import { EventEmitter } from "@angular/core";

interface DbGetTablesOptions {
    onIssue?: EventEmitter<Issue>;

}

export class Issue {
    constructor(
        public readonly issueType: IssueType, 
        public readonly tableName: DbTableName ) {        
    }
}

export enum IssueType {
    CANT_FIND_FOREIGN_KEY_TO_TABLE,
    CANT_FIND_FOREIGN_KEY_FROM_TABLE,
}

export abstract class DbTableSchemaProvider {
    
    constructor(protected config: DbConfig) 
    {
        
    }

    getTables(options: DbGetTablesOptions = {}): Promise<DbTableSchema[]> {
        return Promise
            .all([ this.getTableSchemas(), this.getForiegnKeys() ])
            .then(result => {
                const [tables, foreignKeys] = result; 

                return this.associateTableForeignKeys(tables, foreignKeys, options);
            });
    }

    protected abstract getTableSchemas(): Promise<DbTableSchema[]>

    protected abstract getForiegnKeys(): Promise<DbForeignKeyDetails[]>

    private associateTableForeignKeys(tables: DbTableSchema[], foreignKeys: DbForeignKeyDetails[], options: DbGetTablesOptions): DbTableSchema[] {
       

        foreignKeys.forEach(fk => {
            const to = tables.find(_ => _.name.schema == fk.to.schema && _.name.name == fk.to.name);

            if (!to) {
                options.onIssue?.emit(
                    new Issue(
                        IssueType.CANT_FIND_FOREIGN_KEY_TO_TABLE, 
                        fk.to));

                return;
            }

            const from = tables.find(_ => _.name.schema == fk.from.schema && _.name.name == fk.from.name);

            if (!from) {
                options.onIssue?.emit(
                    new Issue(
                        IssueType.CANT_FIND_FOREIGN_KEY_FROM_TABLE, 
                        fk.from))

                return;
            }

            from.addForeinKey(new DbTableForeignKey(
                fk.name,
                fk.key,
                to));

            to.addForeinKey(new DbTableForeignKey(
                fk.name,
                fk.key.map(_ => _.invert()),
                from
            ))
        });

        return tables;
    }
}

