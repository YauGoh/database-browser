import { DbBrowserTable } from "./db-browser-table";
import { DbBrowsingService } from "../database/services/db-browsing.service";
import { DbType } from "../database/models/db-config";
import { SampleDbQueryService } from "../database/services/sample-db-query.service";
import { SampleDbTableSchemaProvider } from "../database/services/sample-db-table-schema-provider";

describe("DbBrowser", () => {
    let sampleDbTableSchemaProvider: SampleDbTableSchemaProvider;
    let dbBrowsingService: DbBrowsingService;
    let sampleDbQueryService: SampleDbQueryService;
    let tables: DbBrowserTable[];

    beforeEach(async () => {
        sampleDbTableSchemaProvider = new SampleDbTableSchemaProvider();

        sampleDbQueryService = new SampleDbQueryService();
        dbBrowsingService = new DbBrowsingService();

        dbBrowsingService.useQueryService(sampleDbQueryService);

        tables = (
            await sampleDbTableSchemaProvider.getTables({
                name: "Sample",
                dbType: DbType.SAMPLE,
                connectionString: "Connection",
            })
        ).map((t) => new DbBrowserTable(t, dbBrowsingService));
    });
});
