import { Component, OnInit } from '@angular/core';
import { CalendarEvent, CalendarView } from 'angular-calendar';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})


export class HomeComponent implements OnInit {

  constructor(private http: HttpClient, private router: Router) { }

  ngOnInit() {
    this.getDates();
    this.getLinkById();
    this.getGame();
  }

  backendURL = "https://ricsoesatiranyos2.herokuapp.com";
  link: any = "";

  viewDate: Date = new Date();
  view: CalendarView = CalendarView.Month;
  CalendarView = CalendarView;
  events: CalendarEvent[] = [];
  selectedEvent: any;

  games: any[] = [];
  colors: any = { };

  tmpEvents: any[] = [];
  tmpDate: any;

  eventLoaded: any = false;

  dialogClose2: any = 'none';

  getDates(){
    this.http.get<any[]>(this.backendURL+"/api/futureDates").subscribe(
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
              start: new Date(data[index].start),
              end: new Date(data[index].end),
              title: data[index].game.name,
              id: data[index]._id,
              color: this.colors[tmpName]
            });
            
          }
          this.eventLoaded = true;
          this.events = this.tmpEvents;
          if(this.events.length == 0) this.dialogClose2 = 'block';

        },
        error: error => console.log(error)
      }
    )
  }

  whichHour(tmpdate: any): string {
    return tmpdate;
    let date = tmpdate.split('T');
    return date[0].replaceAll('-','. ') + " " + date[1].split(':')[0] + ":" + date[1].split(':')[1].split('.')[0];
  }

  eventPerDay: any;

  dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
    this.selectedEvent = null;
    if(events.length != 0){
      this.eventPerDay = events.filter(x => new Date(x.start).getMonth() == new Date(date).getMonth() && new Date(x.start).getDate() == new Date(date).getDate());
      console.log(this.eventPerDay);
      // this.tmpDate = date.getFullYear() + ". " + ((date.getMonth()+1) < 10 ? '0' + (date.getMonth()+1) : (date.getMonth()+1)) + ". " + ((date.getDate()-1) < 10 ? '0' + (date.getDate()-1) : (date.getDate()-1)) + ". " +(date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ":" + (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes());
      // this.selectedEvent.date = this.tmpDate;     
      // this.selectedEvent.selected = true;
    }
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
        next: (data: any) => {this.selectedEvent = data; console.log(this.selectedEvent);},
        error: error => console.log(error)
      }
    )
  }

  toCalendarDate():any{
    const date = new Date(this.selectedEvent.date);
    return date.getFullYear() + "/" + ((date.getMonth()+1) < 10 ? '0' + (date.getMonth()+1) : (date.getMonth()+1)) + "/" + ((date.getDate()-1) < 10 ? '0' + (date.getDate()-1) : (date.getDate()-1));
  }

  toCalendarTime(type: any): any{
    
    let dates = this.selectedEvent.date.toString().split('.')[0].split(':')[0] + ":" + this.selectedEvent.date.toString().split('.')[0].split(':')[1];
    dates = dates.split('T')[0] + 'T' + (parseInt(dates.split('T')[1].split(':')[0])-2) + ":" + dates.split('T')[1].split(':')[1];
    const date = new Date(dates);
    if(date.getHours() > 12){
      return (type === "start" ? (date.getHours() - 12) : (date.getHours() - 11) ) + ":" + date.getMinutes() + " pm";
    }
    return (type === "start" ? (date.getHours()) : (date.getHours() + 1) ) + ":" + date.getMinutes() + " am";
  }

  PicToBase64(pic: string){
    return  + pic;
  }

  gamePicture(game: string){
    console.log(this.games.filter(x => x.name === game));
    return "data:image/jpeg;base64," + this.games.filter(x => x.name == game)[0].picture
  }

}

