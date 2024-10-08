import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { HomeComponent } from './home/home.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { MachinesComponent } from './machines/machines.component';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTableModule } from '@angular/material/table';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatButtonModule} from '@angular/material/button';
import { AddToCalendarModule } from 'add-events-to-google-calendar';
import { VideosComponent } from './videos/videos.component';
import {MatChipsModule} from '@angular/material/chips';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import { MatFormFieldModule} from '@angular/material/form-field';
import {MatSelectModule} from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { AboutComponent } from './about/about.component';
import { CalendarComponent } from './calendar/calendar.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { ModalComponent } from './modal/modal.component';
import { MdbModalModule } from 'mdb-angular-ui-kit/modal';
import {MatSliderModule} from '@angular/material/slider';
import {MatIconModule} from '@angular/material/icon';
import { AdminComponent } from './admin/admin.component';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { MatNativeDateModule, MAT_DATE_LOCALE } from '@angular/material/core';
import { MaintenanceComponent } from './maintenance/maintenance.component';

import {NgxMaterialTimepickerModule} from 'ngx-material-timepicker';
import { AmazingTimePickerModule } from 'amazing-time-picker';
import { VideoCardComponent } from './video-card/video-card.component';
import { BackInTimeComponent } from './back-in-time/back-in-time.component';
import { AdminNewComponent } from './admin-new/admin-new.component';
import { AdminPastComponent } from './admin-past/admin-past.component';
import { PageSettingsComponent } from './page-settings/page-settings.component';
import {MatBadgeModule} from '@angular/material/badge';
import { EventsComponent } from './events/events.component';
import { GamesComponent } from './games/games.component';
import { SeriesComponent } from './series/series.component';
import { NewHomeComponent } from './new-home/new-home.component';
import { LoadingComponent } from './loading/loading.component';
import { IconComponent } from './icon/icon.component';
import { RegistrationComponent } from './registration/registration.component';
import { StoryComponent } from './story/story.component';



@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    MachinesComponent,
    VideosComponent,
    AboutComponent,
    CalendarComponent,
    PageNotFoundComponent,
    ModalComponent,
    AdminComponent,
    MaintenanceComponent,
    VideoCardComponent,
    BackInTimeComponent,
    AdminNewComponent,
    AdminPastComponent,
    PageSettingsComponent,
    EventsComponent,
    GamesComponent,
    SeriesComponent,
    NewHomeComponent,
    LoadingComponent,
    IconComponent,
    RegistrationComponent,
    StoryComponent
  ],
  imports: [
    HttpClientModule,
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    MatTabsModule,
    MatTableModule,
    MatButtonModule,
    AddToCalendarModule,
    MatChipsModule,
    MatAutocompleteModule,
    MatFormFieldModule,
    MatSelectModule,
    ReactiveFormsModule,
    MatInputModule,
    MdbModalModule,
    MatSliderModule,
    MatIconModule,
    MatTooltipModule,
    MatDatepickerModule,
    MatNativeDateModule,
    AmazingTimePickerModule,
    NgxMaterialTimepickerModule,
    MatBadgeModule,


    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory,
    }),

    BrowserAnimationsModule
  ],
  providers: [
    {provide: MAT_DATE_LOCALE, useValue: 'hu-HU'}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
