import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DbBrowserCardComponent } from './db-browser-card.component';

describe('DbBrowserCardComponent', () => {
  let component: DbBrowserCardComponent;
  let fixture: ComponentFixture<DbBrowserCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DbBrowserCardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DbBrowserCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
