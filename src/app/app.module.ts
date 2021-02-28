import { AppComponent } from "./app.component";
import { AppRoutingModule } from "./app-routing.module";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { BrowserModule } from "@angular/platform-browser";
import { DatabaseModule } from "./database/database.module";
import { DbBrowserCardComponent } from "./components/db-browser-card/db-browser-card.component";
import { DbBrowserLayoutService } from "./services/db-browser-layout.service";
import { DbBrowserPageComponent } from "./pages/db-browser-page/db-browser-page.component";
import { DbConfigsComponent } from "./components/db-configs/db-configs.component";
import { MaterialModule } from "./material/material.module";
import { NgModule } from "@angular/core";
import { NotifyService } from "./notify.service";
import { PositionPipe } from "./pipes/position.pipe";
import { PrimaryKeyPipe } from "./pipes/primary-key.pipe";
import { WelcomePageComponent } from "./welcome-page/welcome-page.component";
import { DbBrowserLinkComponent } from './components/db-browser-link/db-browser-link.component';

@NgModule({
    declarations: [
        AppComponent,
        DbBrowserCardComponent,
        DbBrowserPageComponent,
        DbConfigsComponent,
        WelcomePageComponent,
        DbBrowserCardComponent,
        PositionPipe,
        PrimaryKeyPipe,
        DbBrowserLinkComponent,
    ],
    imports: [
        AppRoutingModule,
        BrowserAnimationsModule,
        BrowserModule,
        DatabaseModule,
        MaterialModule,
    ],
    providers: [DbBrowserLayoutService, NotifyService],
    bootstrap: [AppComponent],
})
export class AppModule {}
