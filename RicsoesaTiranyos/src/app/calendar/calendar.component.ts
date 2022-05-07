import { Component, OnInit } from '@angular/core';
import { CalendarEvent, CalendarView } from 'angular-calendar';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';


import { ModalComponent } from '../modal/modal.component';
import { MdbModalRef, MdbModalService } from 'mdb-angular-ui-kit/modal';
import { NumberInput } from '@angular/cdk/coercion';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent implements OnInit {

  modalRef: MdbModalRef<ModalComponent> | null = null;

  constructor(private http: HttpClient, private router: Router, private modalService: MdbModalService) { }

  ngOnInit() {
    this.getDates();
    this.getRoute();
    this.getLinkById();
    this.getGame();
  }

  getRoute(){
    this.http.get<any[]>(this.backendURL+"/api/pages").subscribe(
      {
        next: (data: any[]) => {
          if(data.filter(x => x.route === "menetrend")[0].disabled){
            this.router.navigateByUrl('/not-found');
          }else{
            this.eventLoaded += 1;
          }

        },
        error: error => console.log(error)
      }
    )
  }

  backendURL = "https://ricsoesatiranyosbackend.herokuapp.com";

  link: any = "";

  viewDate: Date = new Date();
  view: CalendarView = CalendarView.Month;
  CalendarView = CalendarView;
  events: CalendarEvent[] = [];
  selectedEvent: any;

  months: any = [
    "Jan","Feb","Márc","Ápr","Máj","Jún","Júl","Aug","Szept","Okt","Nov","Dec"
  ]

  games: any[] = [];
  colors: any = { };

  tmpEvents: any[] = [];
  tmpDate: any;

  eventLoaded: any = 0;

  dialogClose2: any = 'none';

  getDates(){
    const tmpModal = {
      date: this.format_date(new Date(),"-",":")
    }

    this.http.post<any[]>(this.backendURL+"/api/dates", tmpModal).subscribe(
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
          this.eventLoaded += 1;
          this.events = this.tmpEvents;
          if(this.events.length == 0) this.modalRef = this.modalService.open(ModalComponent);

        },
        error: error => console.log(error)
      }
    )
  }

  convertToTime(date: any): string {
    return (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ":" + (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes());
  }

  convertToDateMonth(date: any): string{
    return this.months[date.getMonth()];
  }
  convertToDate(date: any): string{
    return date.getDate() + ".";
  }

  eventPerDay: any;

  dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
    this.eventPerDay = [];
    if(events.length != 0){
      this.eventPerDay = events.filter(x => new Date(x.start).getMonth() == new Date(date).getMonth() && new Date(x.start).getDate() == new Date(date).getDate());

      // this.tmpDate = date.getFullYear() + ". " + ((date.getMonth()+1) < 10 ? '0' + (date.getMonth()+1) : (date.getMonth()+1)) + ". " + ((date.getDate()-1) < 10 ? '0' + (date.getDate()-1) : (date.getDate()-1)) + ". " +(date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ":" + (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes());
      // this.selectedEvent.date = this.tmpDate;     
      // this.selectedEvent.selected = true;
    }
  }


  getMaxToSlider(start: any, end: any): NumberInput{
    const Dstart = new Date(start);
    const Dend = new Date(end);

    const DstartMin = Dstart.getHours() * 60 + Dstart.getMinutes();
    const DendMin = Dend.getHours() * 60 + Dend.getMinutes();

    const Max = DendMin - DstartMin;
    return Max
  }

  
  getValueToSlider(start: any, end: any): NumberInput{
    const Dstart = new Date(start);
    const Dend = new Date(end);
    const Dnow = new Date();

    if(Dnow < Dstart) return -1;

    const DstartMin = Dstart.getHours() * 60 + Dstart.getMinutes();
    const DendMin = Dend.getHours() * 60 + Dend.getMinutes();
    const DnowMin = Dnow.getHours() * 60 + Dnow.getMinutes();

    if(DendMin < DnowMin) return -1;
    const Now = DnowMin - DstartMin;
    return Now < 0 ? -1 : Now;
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
        next: (data: any) => {this.selectedEvent = data; },
        error: error => console.log(error)
      }
    )
  }

  toCalendarDate(date: any):any{
    const d = new Date(date);
    return d;
  }

  toCalendarTime(date: any,type: any): any{

    const time = (date.getHours() < 10 ? "0"+date.getHours() : date.getHours()) + ":" + (date.getMinutes() < 10 ? "0"+date.getMinutes() : date.getMinutes());

    if(parseFloat(time.split(':')[0]) > 12){
      return time + " pm";
    }
    return time + " am";
  }

  PicToBase64(pic: string){
    return  + pic;
  }

  public loc = "Győr, Hungary";

  ToGoogleCalendar(title: any, description: any, start: any, end: any){
    const final_date = this.format_date(new Date(start),"","",2) + "/" + this.format_date(new Date(end),"","",2);
    window.location.href = "https://www.google.com/calendar/render?action=TEMPLATE&text="+ title +"&dates="+ final_date +"&details="+ description +"&location="+ this.loc +"&sf=true&output=xml";
  }

  gamePicture(game: string){
    return "data:image/jpeg;base64," + this.games.filter(x => x.name == game)[0].picture
  }

  checkLength(title: any, max: any){
    const titles : String = title;
    if(titles.length > max){
      return titles.slice(0,max) + "...";
    }
    return titles;

  }


  format_date(date:any, sep: any, sepHour: any, timeZone: any = 0) {
    var day = date.getDate();
    var monthIndex = date.getMonth();
    var year = date.getFullYear();
    
    var hour = date.getHours();
    var minutes = date.getMinutes();
    
    let formatted_date;
    if(hour === 0 && minutes === 0) {
      formatted_date = ("" + year) + this.zero_pad2(monthIndex + 1) + this.zero_pad2(day);
    } else {
      formatted_date = ("" + year) + sep + this.zero_pad2(monthIndex + 1) + sep + this.zero_pad2(day) + "T" + this.zero_pad2(hour-parseInt(timeZone)) + sepHour + this.zero_pad2(minutes) +sepHour + "00Z";
    }
    
    return formatted_date;
  }

  zero_pad2(num: any) {
    if(num < 10) return "0" + num;
      return num;
  }

  

}
