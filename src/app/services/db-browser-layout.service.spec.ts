import { AppModule } from "../app.module";
import { DbBrowserLayoutService } from "./db-browser-layout.service";
import { DbConfigService } from "../database/services/db-config.service";
import { DbType } from "../database/models/db-config";
import { TestBed } from "@angular/core/testing";

describe("DbBrowserLayoutService", () => {
    let sut: DbBrowserLayoutService;

    let configServiceMock: jasmine.SpyObj<DbConfigService>;

    beforeEach(() => {
        configServiceMock = jasmine.createSpyObj("DbConfigService", [
            "getByName",
        ]) as jasmine.SpyObj<DbConfigService>;

        TestBed.configureTestingModule({
            imports: [AppModule],
        }).overrideProvider(DbConfigService, { useValue: configServiceMock });

        sut = TestBed.inject(DbBrowserLayoutService);
    });

    it("should be created", () => {
        configServiceMock.getByName.and.resolveTo({
            name: "Test",
            dbType: DbType.SAMPLE,
            connectionString: "",
        });

        expect(sut).toBeTruthy();
    });
});
