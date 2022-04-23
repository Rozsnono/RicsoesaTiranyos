import { Component, Inject, OnInit } from '@angular/core';
import { CalendarEvent, CalendarView } from 'angular-calendar';
import { HttpClient } from '@angular/common/http';
import {FormControl, Validators} from '@angular/forms';
import { Router } from '@angular/router';
import {COMMA, ENTER} from '@angular/cdk/keycodes';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})


export class HomeComponent implements OnInit {
  constructor(private http: HttpClient, private router: Router) { }
  
  backendURL = "https://ricsoesatiranyos.herokuapp.com";
  
  
  ngOnInit() {
    this.getDates();
    this.getLinkLastId();
    this.getGames();
    // this.lastId = this.getLinkLastUsedId();
  }
  
  
  displayedColumns: string[] = ['name', 'date', 'functions'];
  dates: any[] = [];

  
  newEventTMPdate: any;
  newEventTMPstart: any;
  newEventTMPend: any;

  newEventTMPgame: any;
  
  converting: any;
  convertLink: any;
  convertTypes: any = [];
  convertEvent: any;
  convertEventName: any;
  convertEventDate: any;
  convertingDate: any = new Date();

  newGameName: any;
  newGameColor: any
  newGamePicture: any;

  newEventTMPdateStart: any;
  newEventTMPdateEnd: any;

  OKmessage: any;
  errorMessage: any;
  
  tmpGameId: any;
  games: any[] = [];


  getDates(){
    this.http.get<any[]>(this.backendURL+"/api/dates").subscribe(
      {
        next: (data: any) => {this.dates = data;},
        error: error => console.log(error)
      }
    )
  }

  saveDates(){
    const TMPdateStart = new Date(this.newEventTMPdate);
    TMPdateStart.setHours(this.newEventTMPstart.split(':')[0]);
    TMPdateStart.setMinutes(this.newEventTMPstart.split(':')[1]);

    const TMPdateEnd = new Date(this.newEventTMPdate);
    TMPdateEnd.setHours(this.newEventTMPend.split(':')[0]);
    TMPdateEnd.setMinutes(this.newEventTMPend.split(':')[1]);


    this.newEventTMPdateStart = (this.convertDate(TMPdateStart,'-',true));
    this.newEventTMPdateEnd = (this.convertDate(TMPdateEnd,'-',true));

    console.log(this.newEventTMPdateStart);
    console.log(this.newEventTMPdateEnd);

    console.log(this.newEventTMPstart);

    const tmpModel = {
      date: String,
      _id: Number,
      game: Number,
    }

    

    tmpModel._id = this.getDateLastId();
    tmpModel.date = this.newEventTMPdate;
    tmpModel.game = this.tmpGameId;

    this.http.post<any[]>(this.backendURL+"/api/date",tmpModel).subscribe(
      {
        next: (data: any) => {this.dates.push(data); this.OKmessage = true; window.location.reload()},
        error: error => this.errorMessage = error.message
      }
    )
  }

  convertDates(id: any){
    this.convertEvent = this.dates.filter(x=>x._id === id)[0];
    this.convertEventName = this.convertEvent.game.name;
    this.convertEventDate = this.convertDate(this.convertEvent.date,". ");
    console.log(this.convertEvent);
  }

  saveLink(){
    const tmpModel = {
      _id: Number,
      link: String,
      name: String,
      picture: String,
      type: Array,
      date: String,
    }

    tmpModel._id = this.LinkLastId + 1;
    tmpModel.link = this.convertLink;
    tmpModel.type = this.convertTypes;
    tmpModel.name = this.convertEvent.game.name;
    tmpModel.picture = this.convertEvent.game.picture;
    tmpModel.date = this.convertingDate;

    this.http.post<any[]>(this.backendURL+"/api/youtube",tmpModel).subscribe(
      {
        next: (data: any) => {this.OKmessage = true; this.deleteDates(this.convertEvent._id)},
        error: error => this.errorMessage = error.message
      }
    )
  }


  getGames(){
    this.http.get<any[]>(this.backendURL+"/api/games").subscribe(
      {
        next: (data: any) => {this.games = data;},
        error: error => console.log(error)
      }
    )
  }

  saveGames(){
    const tmpModel = {
      name: String,
      _id: Number,
      color: String,
      picture: String,
    }

    tmpModel._id = this.getGameLastId();
    tmpModel.name = this.newGameName;
    tmpModel.color = this.newGameColor;
    tmpModel.picture = this.newGamePicture;

    this.http.post<any[]>(this.backendURL+"/api/game",tmpModel).subscribe(
      {
        next: (data: any) => {this.games.push(data); this.OKmessage = true},
        error: error => this.errorMessage = error.message
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

  deleteGames(id: any){
    this.http.delete<any[]>(this.backendURL+"/api/games/"+id).subscribe(
      {
        next: (data: any) => { window.location.reload() },
        error: error => {this.errorMessage = error.message;  window.location.reload(); }
      }
    )
  }

  onUploadChange(evt: any) {
    const file = evt.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = this.handleReaderLoaded.bind(this);
      reader.readAsBinaryString(file);
    }
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

  LinkLastId: any = 0;
  getLinkLastId(): any{
    this.http.get<any[]>(this.backendURL+"/api/youtube").subscribe(
      {
        next: (data: any) => {
          for (let index = 0; index < data.length; index++) {
            this.LinkLastId = data[index]._id > this.LinkLastId ? data[index]._id : this.LinkLastId;
          }
        },
        error: error => console.log(error)
      }
    )
  }

  getGameLastId(): any{
    let max:any = 0;
    this.games.forEach(element => {
      max = element._id > max ? element._id : max;
    });

    return parseFloat(max)+1;
  }

  convertDate(date: any, sep: any, toSave: boolean = false){
    if(toSave){
      const d = new Date(date);
      return d.getFullYear() + sep + (d.getMonth()+1 < 10 ? '0' : '') + (d.getMonth()+1) + sep + (d.getDate() < 10 ? '0' : '') + d.getDate() + (toSave? "T" : sep+"- ") + (d.getHours() < 10 ? '0' : '') + d.getHours() +":" + (d.getMinutes() < 10 ? '0' : '') + d.getMinutes();
    }else{
      const d = date.split('T');
      return d[0].split('-')[0] + sep + d[0].split('-')[1] + sep + d[0].split('-')[2] + sep + "- " + d[1].split(":")[0] +":"+ d[1].split(":")[1];
    }
  
  }

  convertableCheck(d: any){
    return new Date(d) > new Date();
  }


  addOnBlur = true;
  add(event: any): void {
    const value = (event.value || '').trim();
    if (value && !this.convertTypes.includes(value)) {
      this.convertTypes.push(value);
    }
    event.chipInput!.clear();
  }
  readonly separatorKeysCodes = [ENTER, COMMA] as const;
  remove(fruit: any): void {
    const index = this.convertTypes.indexOf(fruit);
    if (index >= 0) {
      this.convertTypes.splice(index, 1);
    }
  }

  //UJRA

}

