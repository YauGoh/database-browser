import { RouterModule, Routes } from '@angular/router';

import { DbBrowserPageComponent } from './db-browser-page/db-browser-page.component';
import { NgModule } from '@angular/core';
import { WelcomePageComponent } from './welcome-page/welcome-page.component';

const routes: Routes = [
  { path: "db-browser", component: DbBrowserPageComponent },
  { path: "**", component: WelcomePageComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
