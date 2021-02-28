import { DbQueryServiceFactory } from "./db-query-service.factory";
import { SampleDbQueryService } from "./sample-db-query.service";
import { TestBed } from "@angular/core/testing";

describe("DbQueryServiceFactoryService", () => {
    let service: DbQueryServiceFactory;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [DbQueryServiceFactory, SampleDbQueryService],
        });
        service = TestBed.inject(DbQueryServiceFactory);
    });

    it("should be created", () => {
        expect(service).toBeTruthy();
    });
});
