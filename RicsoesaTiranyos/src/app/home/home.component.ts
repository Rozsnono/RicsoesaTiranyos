import { Component, OnInit } from '@angular/core';
import { CalendarEvent, CalendarView } from 'angular-calendar';
import { startOfDay, startOfHour } from 'date-fns';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  viewDate: Date = new Date();
  view: CalendarView = CalendarView.Month;
  CalendarView = CalendarView;

  events: CalendarEvent[] = [
    {
      start: startOfHour(new Date('2022-04-12T11:00')),
      title: 'Call of Duty: WarZone',
    },
    {
      start: startOfDay(new Date("2022-04-13")),
      title: 'Fortnite',
    },
    {
      start: startOfDay(new Date("2022-04-10")),
      title: 'Formula1',
    }
  ]

  selectedEvent = "";

  whichHour(date: Date): string {
    return (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ":" + (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes());
  }

  dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
    console.log(date);
    this.selectedEvent = events[0].title;
    //this.openAppointmentList(date)
  }
}
