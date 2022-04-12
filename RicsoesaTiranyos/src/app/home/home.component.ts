import { Component, OnInit } from '@angular/core';
import { CalendarEvent, CalendarView } from 'angular-calendar';
import { startOfDay, startOfHour } from 'date-fns';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})


export class HomeComponent implements OnInit {

  constructor(private http: HttpClient, private router: Router) { }

  async ngOnInit() {
    await this.getDates();
    this.getLinkById();
    this.getGame();
  }

  backendURL = "https://ricsoesatiranyos.herokuapp.com";
  link: any = "";
  viewDate: Date = new Date();
  view: CalendarView = CalendarView.Month;
  CalendarView = CalendarView;
  games: any[] = [];
  colors: any = {
    red: {
      primary: '#ad2121',
      secondary: '#fff'
    },
    blue: {
      primary: '#4d6092',
      secondary: '#fff'
    },
    yellow: {
      primary: '#e3bc08',
      secondary: '#000'
    }
  }

  events: CalendarEvent[] = [];

  selectedEvent: any;

  tmpEvent: any;
  tmpEvents: any[] = [];
  tmpDate: any;

  async getDates(){
    await this.http.get<any[]>(this.backendURL+"/api/dates").subscribe(
      {
        next: (data: any) => {
          for (let index = 0; index < data.length; index++) {
            let tmpName = data[index].game.name;
            let tmpObj = {
              [tmpName] : {
                primary: data[index].game.color,
                secondary: (data[index].game.color == "#ffffff" ? "#000" : "#fff")
              }
            };
            Object.assign(this.colors, tmpObj);
            this.tmpEvents.push({
              start: new Date((data[index].date).toString().split('.')[0]),
              title: data[index].game.name,
              id: data[index]._id,
              color: this.colors[tmpName]
            });
          }
          this.events = this.tmpEvents;

        },
        error: error => console.log(error)
      }
    )
  }

  whichHour(tmpdate: any): string {
    let date = tmpdate.split('T');
    
    return date[0].replaceAll('-','. ') + " " + date[1].split(':')[0] + ":" + date[1].split(':')[2].split('.')[0];
  }


  dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
    this.selectedEvent = null;
    this.getDateId(events[0].id);
    this.tmpDate = date.getFullYear() + ". " + (date.getMonth() < 10 ? '0' + date.getMonth() : date.getMonth()) + ". " + (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) + ". " +(date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ":" + (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes());
    this.selectedEvent.date = this.tmpDate;
    
    this.selectedEvent.selected = true;
    

    //this.openAppointmentList(date)
  }

  getGame(){
    this.http.get<any[]>(this.backendURL+"/api/games").subscribe(
      {
        next: (data: any) => this.games = data,
        error: error => console.log(error)
      }
    )
  }

  getLinkById(){
    this.http.get<any[]>(this.backendURL+"/api/links/1").subscribe(
      {
        next: (data: any) => this.link = data.link,
        error: error => console.log(error)
      }
    )
  }

  getGameId(id: any){
    this.http.get<any[]>(this.backendURL+"/api/games/"+id).subscribe(
      {
        next: (data: any) => {this.selectedEvent.name = data.name;
          this.selectedEvent.picture = data.picture;},
        error: error => console.log(error)
      }
    )
  }


  getDateId(id: any){
    this.http.get<any[]>(this.backendURL+"/api/dates/"+id).subscribe(
      {
        next: (data: any) => this.selectedEvent = data,
        error: error => console.log(error)
      }
    )
  }

  PicToBase64(pic: string){
    return "data:image/jpeg;base64," + pic;
  }

  ToTwitch(){
    this.router.navigateByUrl("https://www.twitch.tv/ricsoesatiranyos");
  }
}

export interface Game{
  
  id: number,
  name: string,
  picture: string,
  color: string
}

