import { ActivatedRoute, ParamMap } from "@angular/router";
import { SampleDbQueryService, sampleTestData } from "src/app/database/services/sample-db-query.service";
import { TestBed, fakeAsync, tick } from "@angular/core/testing";

import { AppModule } from "src/app/app.module";
import { By } from "@angular/platform-browser";
import { CustomMatchers } from "src/app/testing/custom-matchers";
import { DbBrowserCardComponent } from "src/app/components/db-browser-card/db-browser-card.component";
import { DbBrowserEntityPreview } from "src/app/models/db-browser-entity-preview";
import { DbBrowserPageComponent } from "./db-browser-page.component";
import { DbBrowserTable } from "src/app/models/db-browser-table";
import { DbConfigService } from "../../database/services/db-config.service";
import { DbType } from "../../database/models/db-config";
import { NotifyService } from "../../notify.service";
import { sampleTables } from "src/app/database/services/sample-db-table-schema-provider";

describe("DbBrowserPageComponent", () => {
    let dbConfigServiceMock: jasmine.SpyObj<DbConfigService>;

    let paramMapMock: jasmine.SpyObj<ParamMap>;

    let notifyMock: jasmine.SpyObj<NotifyService>;

    beforeEach(() => {
        jasmine.addMatchers(CustomMatchers);
    });

    beforeEach(async () => {
        paramMapMock = jasmine.createSpyObj("ParamMap", ["get"]) as jasmine.SpyObj<ParamMap>;
        dbConfigServiceMock = jasmine.createSpyObj("DbConfigService", ["getByName"]) as jasmine.SpyObj<DbConfigService>;

        notifyMock = jasmine.createSpyObj("NotifyService", ["error", "success", "warning"]) as jasmine.SpyObj<NotifyService>;

        TestBed.configureTestingModule({
            imports: [AppModule],
        })
            .overrideProvider(ActivatedRoute, {
                useValue: {
                    snapshot: {
                        paramMap: paramMapMock,
                    },
                },
            })
            .overrideProvider(DbConfigService, {
                useValue: dbConfigServiceMock,
            })
            .overrideProvider(NotifyService, { useValue: notifyMock })
            .compileComponents();
    });

    beforeEach(() => {});

    it("should initialise dbconfig from route", fakeAsync(() => {
        paramMapMock.get.and.returnValue("testing");

        dbConfigServiceMock.getByName.and.returnValue(
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

        expect(notifyMock.error).toHaveBeenCalledTimes(0);
    }));

    it("should show error message when route parameter not provided", fakeAsync(() => {
        paramMapMock.get.and.returnValue(null);

        const fixture = TestBed.createComponent(DbBrowserPageComponent);
        fixture.detectChanges();
        tick();

        expect(notifyMock.error).toHaveBeenCalledWith("Please provide a valid database config to open.");
    }));

    it("should show error message when config not found", fakeAsync(() => {
        paramMapMock.get.and.returnValue("testing");

        dbConfigServiceMock.getByName.and.returnValue(Promise.resolve(undefined));

        const fixture = TestBed.createComponent(DbBrowserPageComponent);
        fixture.detectChanges();
        tick();

        expect(notifyMock.error).toHaveBeenCalledWith("Unable to locate config 'testing'.");
    }));

    it("Should show list of tables", fakeAsync(() => {
        paramMapMock.get.and.returnValue("testing");

        dbConfigServiceMock.getByName.and.returnValue(
            Promise.resolve({
                connectionString: "a connection string",
                dbType: DbType.SAMPLE,
                name: "testing",
            })
        );

        const fixture = TestBed.createComponent(DbBrowserPageComponent);
        fixture.autoDetectChanges();

        const cut = fixture.componentInstance;
        tick();

        const cards = fixture.debugElement
            .queryAllNodes(By.directive(DbBrowserCardComponent))
            .map((debug) => debug.componentInstance as DbBrowserCardComponent);

        expect(cards).toBeRespectively([
            ...sampleTables.map((t) => (c: DbBrowserCardComponent) => c.table?.name.name === t.name.name && c.table?.name.schema === t.name.schema),
        ]);
    }));

    it("Should expand table to show list of entity previews", fakeAsync(async () => {
        paramMapMock.get.and.returnValue("testing");

        dbConfigServiceMock.getByName.and.returnValue(
            Promise.resolve({
                connectionString: "a connection string",
                dbType: DbType.SAMPLE,
                name: "testing",
            })
        );

        const fixture = TestBed.createComponent(DbBrowserPageComponent);
        fixture.autoDetectChanges();

        const cut = fixture.componentInstance;
        tick();

        await (cut.browserItems[0] as DbBrowserTable).toggleExpand();

        cut.updateLayout();
        tick();

        // assert components
        const cards = fixture.debugElement
            .queryAllNodes(By.directive(DbBrowserCardComponent))
            .map((debug) => debug.componentInstance as DbBrowserCardComponent);

        expect(cards).toBeRespectively([
            ...sampleTables.map((t) => (c: DbBrowserCardComponent) => c.table?.name.name === t.name.name && c.table?.name.schema === t.name.schema),

            ...sampleTestData.users.map((td) => (c: DbBrowserCardComponent) => c.preview?.preview.id === td.id && c.preview?.preview.name === td.name),
        ]);
    }));

    it("Should expand preview to show entity", fakeAsync(async () => {
        paramMapMock.get.and.returnValue("testing");

        dbConfigServiceMock.getByName.and.returnValue(
            Promise.resolve({
                connectionString: "a connection string",
                dbType: DbType.SAMPLE,
                name: "testing",
            })
        );

        const fixture = TestBed.createComponent(DbBrowserPageComponent);
        fixture.autoDetectChanges();

        const cut = fixture.componentInstance;
        tick();

        await (cut.browserItems[0] as DbBrowserTable).toggleExpand();

        cut.updateLayout();
        tick();

        await (cut.browserItems[2] as DbBrowserEntityPreview).toggleExpand();

        cut.updateLayout();
        tick();

        // assert components
        const cards = fixture.debugElement
            .queryAllNodes(By.directive(DbBrowserCardComponent))
            .map((debug) => debug.componentInstance as DbBrowserCardComponent);

        expect(cards).toBeRespectively([
            ...sampleTables.map((t) => (c: DbBrowserCardComponent) => c.table?.name.name === t.name.name && c.table?.name.schema === t.name.schema),

            ...sampleTestData.users.map((td) => (c: DbBrowserCardComponent) => c.preview?.preview.id === td.id && c.preview?.preview.name === td.name),

            (c: DbBrowserCardComponent) =>
                c.entity?.properties[0].value === sampleTestData.users[0].id &&
                c.entity?.properties[1].value === sampleTestData.users[0].departmentId &&
                c.entity?.properties[2].value === sampleTestData.users[0].name &&
                c.entity?.properties[2].value === sampleTestData.users[0].email,
        ]);
    }));

    it("Should layout tables as single column to the left", fakeAsync(() => {
        paramMapMock.get.and.returnValue("testing");

        dbConfigServiceMock.getByName.and.returnValue(
            Promise.resolve({
                connectionString: "a connection string",
                dbType: DbType.SAMPLE,
                name: "testing",
            })
        );

        const fixture = TestBed.createComponent(DbBrowserPageComponent);
        fixture.autoDetectChanges();

        const cut = fixture.componentInstance;
        tick();

        const cards = fixture.debugElement
            .queryAllNodes(By.directive(DbBrowserCardComponent))
            .map((debug) => debug.componentInstance as DbBrowserCardComponent);

        expect(cards).toBeRespectively([...sampleTables.map((t) => (c: DbBrowserCardComponent) => c.rectangle?.location.x === 20)]);

        const doesNotOverlapWithOthers = (c: DbBrowserCardComponent, others: DbBrowserCardComponent[]): boolean => {
            for (const other of others) {
                expect(c.rectangle?.overlaps(other.rectangle!)).toBe(false, "Doesn't overlap");
            }

            return true;
        };

        expect(cards).toOthers(
            [...sampleTables.map((t) => doesNotOverlapWithOthers)],

            "Card's rectangles should not overlap"
        );
    }));
});
