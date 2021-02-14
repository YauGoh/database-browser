import { AppComponent } from './app.component';
import { DatabaseModule } from './database/database.module';
import { DbConfigsComponent } from './db-configs/db-configs.component';
import { MaterialModule } from './material/material.module';
import { NotifyService } from './notify.service';
import { RouterTestingModule } from '@angular/router/testing';
import { TestBed } from '@angular/core/testing';

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        DatabaseModule, MaterialModule, RouterTestingModule
      ],
      declarations: [
        AppComponent, DbConfigsComponent
      ],
      providers: [ NotifyService ]
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });
});
