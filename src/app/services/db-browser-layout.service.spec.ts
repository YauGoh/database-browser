import { AppModule } from "../app.module";
import { DbBrowserLayoutService } from "./db-browser-layout.service";
import { TestBed } from "@angular/core/testing";

describe("DbBrowserLayoutService", () => {
    let service: DbBrowserLayoutService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [AppModule],
        });
        service = TestBed.inject(DbBrowserLayoutService);
    });

    it("should be created", () => {
        expect(service).toBeTruthy();
    });
});
