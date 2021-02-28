import { Component, OnInit } from "@angular/core";
import { DbBrowser, Link } from "../../models/db-browser";

import { ActivatedRoute } from "@angular/router";
import { DbBrowserLayoutService } from "../../services/db-browser-layout.service";
import { DbBrowserTable } from "src/app/models/db-browser-table";
import { DbBrowsingService } from "../../database/services/db-browsing.service";
import { DbConfig } from "../../database/models/db-config";
import { DbConfigService } from "../../database/services/db-config.service";
import { DbQueryServiceFactory } from "../../database/services/db-query-service.factory";
import { DbTableSchema } from "../../database/models/db-table-schema";
import { DbTableSchemaProviderFactory } from "../../database/services/db-table-schema-provider.factory";
import { NotifyService } from "../../notify.service";

@Component({
    selector: "app-db-browser-page",
    templateUrl: "./db-browser-page.component.html",
    styleUrls: ["./db-browser-page.component.scss"],
})
export class DbBrowserPageComponent implements OnInit {
    dbConfig: DbConfig | undefined = undefined;
    tables: DbBrowserTable[] | undefined;
    browserItems: DbBrowser[] = [];
    browserLinks: Link[] = [];

    showParameterError: boolean = false;
    showMissingConfig: boolean = false;

    constructor(
        private route: ActivatedRoute,
        private configService: DbConfigService,
        private dbSchemaProviderFactory: DbTableSchemaProviderFactory,
        private queryServiceFactory: DbQueryServiceFactory,
        private browsingService: DbBrowsingService,
        private notify: NotifyService,
        private layoutService: DbBrowserLayoutService
    ) {}

    async ngOnInit(): Promise<void> {
        try {
            const name = this.route.snapshot.paramMap.get("name");

            if (!name) {
                this.notify.error(
                    "Please provide a valid database config to open."
                );
                return;
            }

            const dbConfig = await this.configService.getByName(name);

            if (!dbConfig) {
                this.notify.error(`Unable to locate config '${name}'.`);
                return;
            }

            this.dbConfig = dbConfig;

            const tables = await this.resolveSchema(dbConfig);

            if (!tables) {
                this.notify.error(`Unable to resolve schema.`);
                return;
            }

            this.tables = tables.map(
                (t) => new DbBrowserTable(t, this.browsingService)
            );

            const queryService = this.queryServiceFactory.get(dbConfig);
            this.browsingService.useQueryService(queryService);

            const layoutResult = this.layoutService.layout(this.tables);

            this.browserItems = layoutResult.items;
            this.browserLinks = layoutResult.links;
        } catch (error) {
            this.notify.error("Unhandled error occurred");
        }
    }

    resolveSchema(config: DbConfig): Promise<DbTableSchema[] | undefined> {
        const provider = this.dbSchemaProviderFactory.get(config);

        if (provider == null) return Promise.resolve(undefined);

        return provider.getTables(config);
    }

    updateLayout() {
        console.log("updateLayout", this.tables);

        if (!this.tables) return;

        const layoutResult = this.layoutService.layout(this.tables);

        this.browserItems = layoutResult.items;
        this.browserLinks = layoutResult.links;

        console.log("updated", this.browserItems);
    }

    async onTableExpanded(table: DbTableSchema): Promise<void> {
        const entities = await this.browsingService.getTablePreview(table);
    }
}
