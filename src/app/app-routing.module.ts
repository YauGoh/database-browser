import { RouterModule, Routes } from "@angular/router";

import { DbBrowserPageComponent } from "./pages/db-browser-page/db-browser-page.component";
import { NgModule } from "@angular/core";
import { WelcomePageComponent } from "./pages/welcome-page/welcome-page.component";

const routes: Routes = [
    { path: "db-browser/:name", component: DbBrowserPageComponent },
    { path: "**", component: WelcomePageComponent },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
})
export class AppRoutingModule {}
