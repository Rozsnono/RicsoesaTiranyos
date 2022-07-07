import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { MachinesComponent } from './machines/machines.component';
import { VideosComponent } from './videos/videos.component';
import { AboutComponent } from './about/about.component';
import { CalendarComponent } from './calendar/calendar.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { AdminComponent } from './admin/admin.component';
import { MaintenanceComponent } from './maintenance/maintenance.component';
import { BackInTimeComponent } from './back-in-time/back-in-time.component';
import { AdminNewComponent } from './admin-new/admin-new.component';
import { PageSettingsComponent } from './page-settings/page-settings.component';

const routes: Routes = [
  {path: "menetrend", component: CalendarComponent},
  {path: "gepeink", component: MachinesComponent},
  {path: "sorozatok", component: VideosComponent},
  {path: "rolunk", component: AboutComponent},
  {path: "", component: HomeComponent},
  {path: "error", component: MaintenanceComponent},
  {path: "admin", component: AdminComponent},
  {path: "admin/uj", component: AdminNewComponent},
  {path: "admin/oldal", component: PageSettingsComponent},
  {path: "backintime", component: BackInTimeComponent},
  {path: "**", pathMatch: 'full', component: PageNotFoundComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    scrollPositionRestoration: 'enabled',
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
