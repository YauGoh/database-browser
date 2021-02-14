import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { DatabaseModule } from './database/database.module';
import { DbBrowserPageComponent } from './db-browser-page/db-browser-page.component';
import { DbConfigsComponent } from './db-configs/db-configs.component';
import { MaterialModule } from './material/material.module';
import { NgModule } from '@angular/core';
import { NotifyService } from './notify.service';
import { WelcomePageComponent } from './welcome-page/welcome-page.component';

@NgModule({
  declarations: [
    AppComponent,
    DbBrowserPageComponent,
    DbConfigsComponent,
    WelcomePageComponent,
  ],
  imports: [
    AppRoutingModule,
    BrowserAnimationsModule,
    BrowserModule,
    DatabaseModule,
    MaterialModule
  ],
  providers: [NotifyService],
  bootstrap: [AppComponent]
})
export class AppModule { }
