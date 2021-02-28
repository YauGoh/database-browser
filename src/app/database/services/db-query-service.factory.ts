import { DbConfig, DbType } from "../models/db-config";

import { DbQueryService } from "./db-query.service";
import { Injectable } from "@angular/core";
import { SampleDbQueryService } from "./sample-db-query.service";

@Injectable()
export class DbQueryServiceFactory {
    constructor(private sampleDbQueryServer: SampleDbQueryService) {}

    public get(config: DbConfig): DbQueryService {
        switch (config.dbType) {
            case DbType.SAMPLE:
                return this.sampleDbQueryServer;
        }
    }
}
