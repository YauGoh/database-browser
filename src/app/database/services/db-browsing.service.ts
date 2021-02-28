import { DbEntity, DbProperties } from "../models/db-entity";

import { DbQueryService } from "./db-query.service";
import { DbTableForeignKey } from "../models/db-table-foreign-key";
import { DbTableSchema } from "../models/db-table-schema";
import { Injectable } from "@angular/core";

@Injectable()
export class DbBrowsingService {
    private _queryService: DbQueryService | undefined;

    constructor() {}

    public useQueryService(queryService: DbQueryService) {
        this._queryService = queryService;
    }

    public async getTablePreview(table: DbTableSchema): Promise<DbEntity[]> {
        if (!this._queryService) throw new Error("Query Service is required");

        const previewQuery = table.getPreviewQuery();

        const dataRows = await this._queryService.select(previewQuery);

        return dataRows.map(
            (row) => new DbEntity(table, this.getPrimaryKey(table, row), row)
        );
    }

    public async getForeignKeyEntities(
        parent: DbEntity,
        foreignKey: DbTableForeignKey
    ): Promise<DbEntity[]> {
        const query = foreignKey.toDbQuery(parent);

        const dataRows = await this._queryService!.select(query);

        return dataRows.map(
            (row) =>
                new DbEntity(
                    foreignKey.toTable,
                    this.getPrimaryKey(foreignKey.toTable, row),
                    row
                )
        );
    }

    public async populateEntity(entity: DbEntity): Promise<void> {
        if (!this._queryService) throw new Error("Query Service is required");

        const query = entity.getDataQuery();

        const dataRows = await this._queryService.select(query);

        if (dataRows.length == 0) return;

        entity.setData(dataRows[0]);
    }

    getPrimaryKey(
        table: DbTableSchema,
        properties: DbProperties
    ): DbProperties {
        const primaryKey: DbProperties = {};

        table.primaryKey.forEach((key) => {
            primaryKey[key.name] = properties[key.name];
        });

        return primaryKey;
    }
}
