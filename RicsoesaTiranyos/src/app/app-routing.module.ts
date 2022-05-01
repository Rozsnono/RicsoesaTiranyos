import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { MachinesComponent } from './machines/machines.component';
import { VideosComponent } from './videos/videos.component';
import { AboutComponent } from './about/about.component';
import { CalendarComponent } from './calendar/calendar.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';

const routes: Routes = [
  {path: "menetrend", component: CalendarComponent},
  {path: "gepeink", component: MachinesComponent},
  {path: "videok", component: VideosComponent},
  {path: "rolunk", component: AboutComponent},
  {path: "", component: HomeComponent},
  {path: "**", pathMatch: 'full', component: PageNotFoundComponent}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
