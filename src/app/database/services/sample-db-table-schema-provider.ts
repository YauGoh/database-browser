import { ColumnType, DbTableColumn } from "../models/db-table-column";

import { DbForeignKeyDetails } from "../models/db-foreign-key-details";
import { DbTableForeignKeyMap } from "../models/db-table-foreign-key";
import { DbTableName } from "../models/db-table-name";
import { DbTableSchema } from "../models/db-table-schema";
import { DbTableSchemaProvider } from "./db-table-schema-provider";
import { Injectable } from "@angular/core";

export const sampleTables = [
    new DbTableSchema(
        new DbTableName("dbo", "users"),
        [new DbTableColumn("id", ColumnType.NUMBER)],
        [
            new DbTableColumn("id", ColumnType.NUMBER),
            new DbTableColumn("departmentId", ColumnType.NUMBER),
            new DbTableColumn("name", ColumnType.STRING),
            new DbTableColumn("email", ColumnType.STRING),
        ]
    ),

    new DbTableSchema(
        new DbTableName("dbo", "departments"),
        [new DbTableColumn("id", ColumnType.NUMBER)],
        [
            new DbTableColumn("id", ColumnType.NUMBER),
            new DbTableColumn("name", ColumnType.STRING),
        ]
    ),
];

export const sampleForeignKeys = [
    new DbForeignKeyDetails(
        "fk_users_departments",
        new DbTableName("dbo", "users"),
        new DbTableName("dbo", "departments"),
        [
            new DbTableForeignKeyMap(
                new DbTableColumn("departmentId", ColumnType.NUMBER),
                new DbTableColumn("id", ColumnType.NUMBER)
            ),
        ]
    ),
];

@Injectable()
export class SampleDbTableSchemaProvider extends DbTableSchemaProvider {
    protected getTableSchemas(): Promise<DbTableSchema[]> {
        return Promise.resolve(sampleTables);
    }

    protected getForiegnKeys(): Promise<DbForeignKeyDetails[]> {
        return Promise.resolve(sampleForeignKeys);
    }
}
