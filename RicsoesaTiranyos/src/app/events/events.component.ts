import { HttpClient } from '@angular/common/http';
import { Component, OnInit, Inject} from '@angular/core';
import { CalendarEvent, CalendarView } from 'angular-calendar';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import { Router } from '@angular/router';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import { AmazingTimePickerService } from 'amazing-time-picker';
import { NgxMaterialTimepickerTheme } from 'ngx-material-timepicker';

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.css']
})
export class EventsComponent implements OnInit {
  backendURL = "https://ricsoesatiranyosbackend.herokuapp.com";
  constructor(private http: HttpClient, private router: Router, private atp: AmazingTimePickerService) { }

  ngOnInit(): void {

    if(!this.checking()){
      window.location.href = "";
    }

    this.getDates();
    this.getGames();
  }


  checking(){
    return sessionStorage["user"];
  }

  range = new FormGroup({
    start: new FormControl,
    end: new FormControl,
  });

  displayedColumns: string[] = ['name', 'functions'];
  dates: any[] = [];

  isModify: boolean = false;
  isModifyGame: boolean = false;

  newEventTMPdate: any;
  newEventTMPstart: any;
  newEventTMPend: any;

  newEventTMPgame: any;

  convertLink: any;
  convertTypes: any = [];
  convertEvent: any;
  convertEventName: any;
  convertEventDate: any;


  newGameName: any;
  newGameColor: any
  newGamePicture: any;

  newEventTMPdateStart: any;
  newEventTMPdateEnd: any;

  OKmessage: any;
  errorMessage: any;

  tmpGameId: any;
  games: any[] = [];
  pages: any[];



  getDates(){

    this.http.get<any[]>(this.backendURL+"/api/alldates",).subscribe(
      {
        next: (data: any) => {this.dates = data.sort((n1: any,n2: any) => {
          if (n1.start > n2.start) {
              return 1;
          }

          if (n1.start < n2.start) {
              return -1;
          }

          return 0;
          });
          this.countDates();
        },
        error: error => console.log(error)
      }
    )
  }


  countDates(){
    this.dates.forEach(element => {
      if(!this.convertableCheck(element.end)){
        this.numberOfDates++;
      }
    });
  }

  numberOfDates: any = 0;

  onChangeTime(time: any){

    if(parseInt(time.split(':')[1]) >= 0 && parseInt(time.split(':')[1]) < 10) time = time.split(':')[0] + ":00";
    if(parseInt(time.split(':')[1]) >= 50 && parseInt(time.split(':')[1]) < 60) time = time.split(':')[0] + ":00";
    if(parseInt(time.split(':')[1]) >= 10 && parseInt(time.split(':')[1]) < 20) time = time.split(':')[0] + ":15";
    if(parseInt(time.split(':')[1]) >= 20 && parseInt(time.split(':')[1]) < 40) time = time.split(':')[0] + ":30";
    if(parseInt(time.split(':')[1]) >= 40 && parseInt(time.split(':')[1]) < 50) time = time.split(':')[0] + ":45";
    this.newEventTMPstart = time;
    this.newEventTMPend = time;
  }

  darkTheme: NgxMaterialTimepickerTheme = {
    container: {
        bodyBackgroundColor: '#424242',
        buttonColor: '#fff'
    },
    dial: {
        dialBackgroundColor: '#555',
    },
    clockFace: {
        clockFaceBackgroundColor: '#555',
        clockHandColor: '#9fbd90',
        clockFaceTimeInactiveColor: '#fff'
    }
};

  saveDates(){

    const TMPdateStart = new Date(this.newEventTMPdateStart);
    TMPdateStart.setHours(this.newEventTMPstart.split(':')[0]);
    TMPdateStart.setMinutes(this.newEventTMPstart.split(':')[1]);

    const TMPdateEnd = new Date(this.newEventTMPdateEnd);
    if(this.newEventTMPend.split(':')[0] == "00") TMPdateEnd.setDate(TMPdateEnd.getDate()+1);
    TMPdateEnd.setHours(this.newEventTMPend.split(':')[0]);
    TMPdateEnd.setMinutes(this.newEventTMPend.split(':')[1]);


    this.newEventTMPdateStart = (this.convertDate(TMPdateStart,'-',true));
    this.newEventTMPdateEnd = (this.convertDate(TMPdateEnd,'-',true));

    const tmpModel = {
      start: String,
      end: String,
      _id: Number,
      game: Number,
    }



    tmpModel._id = this.getDateLastId();
    tmpModel.start = this.newEventTMPdateStart;
    tmpModel.end = this.newEventTMPdateEnd;
    tmpModel.game = this.tmpGameId;

    if(TMPdateStart > TMPdateEnd){
      this.errorMessage = "error";
    }else{
      this.http.post<any[]>(this.backendURL+"/api/date",tmpModel).subscribe(
        {
          next: (data: any) => {this.dates.push(data); this.OKmessage = true; window.location.reload()},
          error: error => this.errorMessage = error.message
        }
      )
    }


  }



  modifyDate(){
    const TMPdateStart = new Date(this.newEventTMPdateStart);
    TMPdateStart.setHours(this.newEventTMPstart.split(':')[0]);
    TMPdateStart.setMinutes(this.newEventTMPstart.split(':')[1]);

    const TMPdateEnd = new Date(this.newEventTMPdateEnd);
    if(this.newEventTMPend.split(':')[0] == "00") TMPdateEnd.setDate(TMPdateEnd.getDate()+1);
    TMPdateEnd.setHours(this.newEventTMPend.split(':')[0]);
    TMPdateEnd.setMinutes(this.newEventTMPend.split(':')[1]);


    this.newEventTMPdateStart = (this.convertDate(TMPdateStart,'-',true));
    this.newEventTMPdateEnd = (this.convertDate(TMPdateEnd,'-',true));

    const tmpModel = {
      start: String,
      end: String,
      _id: Number,
      game: Number,
    }



    tmpModel._id = this.selectedEventId;
    tmpModel.start = this.newEventTMPdateStart;
    tmpModel.end = this.newEventTMPdateEnd;
    tmpModel.game = this.tmpGameId;

    this.http.put<any[]>(this.backendURL+"/api/date/"+this.selectedEventId ,tmpModel).subscribe(
      {
        next: (data: any) => {window.location.reload()},
        error: error => this.errorMessage = error.message
      }
    )
  }

  missingDate(element: any, denied: boolean){

    const tmpModel = {
      start: element.start,
      end: element.end,
      _id: element._id,
      game: this.games.filter(x => x.name === element.game.name)[0]._id,
      missing: denied
    }


    this.http.put<any[]>(this.backendURL+"/api/date/"+element._id ,tmpModel).subscribe(
      {
        next: (data: any) => {window.location.reload()},
        error: error => this.errorMessage = error.message
      }
    )
  }

  async resetPage() {
    window.location.reload();
    // await this.router.navigateByUrl('.', { skipLocationChange: true });
    // return this.router.navigateByUrl('admin/uj');
  }


  checkLength(title: any, max: any){
    const titles : String = title;
    if(titles.length > max){
      return titles.slice(0,max) + "...";
    }
    return titles;

  }


  getGames(){
    this.http.get<any[]>(this.backendURL+"/api/games").subscribe(
      {
        next: (data: any) => {this.games = data;},
        error: error => console.log(error)
      }
    )
  }


  deleteDates(id: any){
    this.http.delete<any[]>(this.backendURL+"/api/dates/"+id).subscribe(
      {
        next: (data: any) => {window.location.reload()},
        error: error => {this.errorMessage = error.message;  window.location.reload();}
      }
    )
  }

  DeletePastStreams(){
    let tmpCounter = 0;
    for (let index = 0; index < this.dates.length; index++) {
      const element = this.dates[index];


      if(!this.convertableCheck(element.end)){
        this.http.delete<any[]>(this.backendURL+"/api/dates/"+element._id).subscribe(
          {
            next: (data: any) => {tmpCounter++;},
            error: error => {this.errorMessage = error.message; tmpCounter++; if(tmpCounter === this.numberOfDates){
              window.location.reload();
             }}
          }
        )
      }

    }

  }


  selectedEventId: any;
  dateById(id: any){
    this.isModify = true;
    const selectedEvent = this.dates.filter(x => x._id === id)[0];
    this.selectedEventId = selectedEvent._id;
    this.newEventTMPdateStart = selectedEvent.start.split('T')[0];
    this.newEventTMPdateEnd = selectedEvent.end.split('T')[0];

    this.newEventTMPstart = selectedEvent.start.split('T')[1];
    this.newEventTMPend = selectedEvent.end.split('T')[1];
    const selectedGame = this.games.filter(x => x.name === selectedEvent.game.name)[0];
    this.tmpGameId = selectedGame._id;
  }


  newEventDateChange(e: any){
    this.newEventTMPdate = e.target.value;
  }

  handleReaderLoaded(e: any) {
    this.newGamePicture = btoa(e.target.result);
  }

  getGameIdforSelect(e: any){
    this.newEventTMPgame = e;
  }

  getDateLastId(): any{
    let max:any = 0;
    this.dates.forEach(element => {
      max = element._id > max ? element._id : max;
    });

    return parseFloat(max)+1;
  }

  convertDate(date: any, sep: any, toSave: boolean = false, onlyTime: boolean = null){
    if(toSave){
      const d = new Date(date);
      if(onlyTime === null){
        return d.getFullYear() + sep + (d.getMonth()+1 < 10 ? '0' : '') + (d.getMonth()+1) + sep + (d.getDate() < 10 ? '0' : '') + d.getDate() + (toSave? "T" : sep+"- ") + (d.getHours() < 10 ? '0' : '') + d.getHours() +":" + (d.getMinutes() < 10 ? '0' : '') + d.getMinutes();
      }else if(onlyTime){
        return (d.getHours() < 10 ? '0' : '') + d.getHours() +":" + (d.getMinutes() < 10 ? '0' : '') + d.getMinutes();
      }

      return d.getFullYear() + sep + (d.getMonth()+1 < 10 ? '0' : '') + (d.getMonth()+1) + sep + (d.getDate() < 10 ? '0' : '') + d.getDate();

    }else{
      const d = date.split('T');
      if(onlyTime === null){
        return d[0].split('-')[0] + sep + d[0].split('-')[1] + sep + d[0].split('-')[2] + sep + "- " + d[1].split(":")[0] +":"+ d[1].split(":")[1];
      }else if(onlyTime){
        return d[1].split(":")[0] +":"+ d[1].split(":")[1];
      }

      return d[0].split('-')[0] + sep + d[0].split('-')[1] + sep + d[0].split('-')[2] + sep;

    }

  }

  convertableCheck(d: any){
    return new Date(d) > new Date();
  }

  username: any;
  password: any;


  gamePicture(pic: string){
    return "data:image/jpeg;base64," + pic;
  }

}


