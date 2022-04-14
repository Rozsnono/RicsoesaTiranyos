import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { MachinesComponent } from './machines/machines.component';
import { VideosComponent } from './videos/videos.component';

const routes: Routes = [
  {path: "", component: HomeComponent},
  {path: "gepeink", component: MachinesComponent},
  {path: "videok", component: VideosComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
