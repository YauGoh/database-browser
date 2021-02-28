import { ComponentFixture, TestBed } from "@angular/core/testing";

import { DbConfigService } from "../../database/services/db-config.service";
import { DbConfigsComponent } from "./db-configs.component";
import { MaterialModule } from "../../material/material.module";

describe("DbConfigsComponent", () => {
    let component: DbConfigsComponent;
    let fixture: ComponentFixture<DbConfigsComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [DbConfigsComponent],
            imports: [MaterialModule],
            providers: [DbConfigService],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(DbConfigsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
