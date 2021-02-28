import { CommonModule } from "@angular/common";
import { DbBrowsingService } from "./services/db-browsing.service";
import { DbConfigService } from "./services/db-config.service";
import { DbQueryServiceFactory } from "./services/db-query-service.factory";
import { DbTableSchemaProviderFactory } from "./services/db-table-schema-provider.factory";
import { NgModule } from "@angular/core";
import { SampleDbQueryService } from "./services/sample-db-query.service";
import { SampleDbTableSchemaProvider } from "./services/sample-db-table-schema-provider";

@NgModule({
    declarations: [],
    imports: [CommonModule],
    providers: [
        DbBrowsingService,
        DbConfigService,
        DbQueryServiceFactory,
        DbTableSchemaProviderFactory,
        SampleDbTableSchemaProvider,
        SampleDbQueryService,
    ],
})
export class DatabaseModule {}
