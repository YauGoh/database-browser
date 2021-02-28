import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DbBrowserLinkComponent } from './db-browser-link.component';

describe('DbBrowserLinkComponent', () => {
  let component: DbBrowserLinkComponent;
  let fixture: ComponentFixture<DbBrowserLinkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DbBrowserLinkComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DbBrowserLinkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
