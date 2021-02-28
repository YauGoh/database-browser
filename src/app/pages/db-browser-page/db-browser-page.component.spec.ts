import { ActivatedRoute, ParamMap } from "@angular/router";
import { TestBed, fakeAsync, tick } from "@angular/core/testing";

import { DbBrowserCardComponent } from "../../components/db-browser-card/db-browser-card.component";
import { DbBrowserLayoutService } from "../../services/db-browser-layout.service";
import { DbBrowserPageComponent } from "./db-browser-page.component";
import { DbBrowsingService } from "../../database/services/db-browsing.service";
import { DbConfigService } from "../../database/services/db-config.service";
import { DbQueryServiceFactory } from "../../database/services/db-query-service.factory";
import { DbTableSchemaProviderFactory } from "../../database/services/db-table-schema-provider.factory";
import { DbType } from "../../database/models/db-config";
import { MaterialModule } from "../../material/material.module";
import { NotifyService } from "../../notify.service";
import { PositionPipe } from "../../pipes/position.pipe";
import { SampleDbQueryService } from "../../database/services/sample-db-query.service";
import { SampleDbTableSchemaProvider } from "../../database/services/sample-db-table-schema-provider";

describe("DbBrowserPageComponent", () => {
    let dbConfigServiceSpy: jasmine.SpyObj<DbConfigService>;

    let paramMapSpy: jasmine.SpyObj<ParamMap>;

    let notifySpy: jasmine.SpyObj<NotifyService>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [
                DbBrowserPageComponent,
                DbBrowserCardComponent,
                PositionPipe,
            ],
            imports: [MaterialModule],
            providers: [
                {
                    provide: ActivatedRoute,
                    useValue: {
                        snapshot: {
                            paramMap: jasmine.createSpyObj("ParamMap", ["get"]),
                        },
                    },
                },

                {
                    provide: DbConfigService,
                    useValue: jasmine.createSpyObj("DbConfigService", [
                        "getByName",
                    ]),
                },
                DbBrowsingService,
                DbQueryServiceFactory,
                DbBrowserLayoutService,
                DbTableSchemaProviderFactory,
                SampleDbTableSchemaProvider,
                {
                    provide: NotifyService,
                    useValue: jasmine.createSpyObj("NotifyService", [
                        "error",
                        "success",
                        "warning",
                    ]),
                },
                SampleDbQueryService,
            ],
        }).compileComponents();

        dbConfigServiceSpy = TestBed.inject(
            DbConfigService
        ) as jasmine.SpyObj<DbConfigService>;
        paramMapSpy = TestBed.inject(ActivatedRoute).snapshot
            .paramMap as jasmine.SpyObj<ParamMap>;
        notifySpy = TestBed.inject(
            NotifyService
        ) as jasmine.SpyObj<NotifyService>;
    });

    beforeEach(() => {});

    it("should initialise dbconfig from route", fakeAsync(() => {
        paramMapSpy.get.and.returnValue("testing");

        dbConfigServiceSpy.getByName.and.returnValue(
            Promise.resolve({
                connectionString: "a connection string",
                dbType: DbType.SAMPLE,
                name: "testing",
            })
        );

        const fixture = TestBed.createComponent(DbBrowserPageComponent);
        const cut = fixture.componentInstance;
        fixture.detectChanges();
        tick();

        expect(cut.dbConfig?.name).toBe("testing");
        expect(cut.dbConfig?.connectionString).toBe("a connection string");
        expect(cut.dbConfig?.dbType).toBe(DbType.SAMPLE);

        expect(notifySpy.error).toHaveBeenCalledTimes(0);
    }));

    it("should show error message when route parameter not provided", fakeAsync(() => {
        paramMapSpy.get.and.returnValue(null);

        const fixture = TestBed.createComponent(DbBrowserPageComponent);
        const cut = fixture.componentInstance;
        fixture.detectChanges();
        tick();

        expect(notifySpy.error).toHaveBeenCalledWith(
            "Please provide a valid database config to open."
        );
    }));

    it("should show error message when config not found", fakeAsync(() => {
        paramMapSpy.get.and.returnValue("testing");

        dbConfigServiceSpy.getByName.and.returnValue(
            Promise.resolve(undefined)
        );

        const fixture = TestBed.createComponent(DbBrowserPageComponent);
        const cut = fixture.componentInstance;
        fixture.detectChanges();
        tick();

        expect(notifySpy.error).toHaveBeenCalledWith(
            "Unable to locate config 'testing'."
        );
    }));
});
