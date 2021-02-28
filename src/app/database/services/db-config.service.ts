import { DbConfig, DbType } from "../models/db-config";

import { Injectable } from "@angular/core";

@Injectable()
export class DbConfigService {
    getByName(name: string): Promise<DbConfig | undefined> {
        return this.get().then((configs) =>
            configs.find((_) => _.name === name)
        );
    }

    constructor() {}

    public get(): Promise<DbConfig[]> {
        return Promise.resolve([
            {
                name: "Sample",
                dbType: DbType.SAMPLE,
                connectionString: "sample-connection-string",
            },
        ]);
    }
}
