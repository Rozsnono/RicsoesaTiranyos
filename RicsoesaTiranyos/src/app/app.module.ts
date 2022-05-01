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
import { MAT_DATE_LOCALE } from '@angular/material/core';
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



@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    MachinesComponent,
    VideosComponent,
    AboutComponent,
    CalendarComponent,
    PageNotFoundComponent
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
