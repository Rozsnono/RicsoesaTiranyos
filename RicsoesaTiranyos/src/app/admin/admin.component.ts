import { HttpClient } from '@angular/common/http';
import { Component, OnInit, Inject} from '@angular/core';
import { CalendarEvent, CalendarView } from 'angular-calendar';
import {FormControl, Validators} from '@angular/forms';
import { Router } from '@angular/router';
import {COMMA, ENTER} from '@angular/cdk/keycodes';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
  backendURL = "https://ricsoesatiranyosbackend.herokuapp.com";
  constructor(private http: HttpClient, private router: Router) { }

  ngOnInit(): void {
    this.getDates();
    this.getLinkLastId();
    this.getGames();
  }

  displayedColumns: string[] = ['name', 'functions'];
  dates: any[] = [];

  isModify: boolean = false;
  isModifyGame: boolean = false;

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
          });},
        error: error => console.log(error)
      }
    )
  }

  onChangeTime(time: any){
    console.log(parseInt(time.target.value.split(':')[1]) >= 50 && parseInt(time.target.value.split(':')[1]) < 10);
    
    if(parseInt(time.target.value.split(':')[1]) >= 0 && parseInt(time.target.value.split(':')[1]) < 10) time.target.value = time.target.value.split(':')[0] + ":00";
    if(parseInt(time.target.value.split(':')[1]) >= 50 && parseInt(time.target.value.split(':')[1]) < 60) time.target.value = time.target.value.split(':')[0] + ":00";
    if(parseInt(time.target.value.split(':')[1]) >= 10 && parseInt(time.target.value.split(':')[1]) < 20) time.target.value = time.target.value.split(':')[0] + ":15";
    if(parseInt(time.target.value.split(':')[1]) >= 20 && parseInt(time.target.value.split(':')[1]) < 40) time.target.value = time.target.value.split(':')[0] + ":30";
    if(parseInt(time.target.value.split(':')[1]) >= 40 && parseInt(time.target.value.split(':')[1]) < 50) time.target.value = time.target.value.split(':')[0] + ":45";
    this.newEventTMPstart = time.target.value;
    this.newEventTMPend = time.target.value;
  }

  saveDates(){
    const TMPdateStart = new Date(this.newEventTMPdate);
    TMPdateStart.setHours(this.newEventTMPstart.split(':')[0]);
    TMPdateStart.setMinutes(this.newEventTMPstart.split(':')[1]);

    const TMPdateEnd = new Date(this.newEventTMPdate);
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

    this.http.post<any[]>(this.backendURL+"/api/date",tmpModel).subscribe(
      {
        next: (data: any) => {this.dates.push(data); this.OKmessage = true; window.location.reload()},
        error: error => this.errorMessage = error.message
      }
    )
  }

  modifyDate(){
    const TMPdateStart = new Date(this.newEventTMPdate);
    TMPdateStart.setHours(this.newEventTMPstart.split(':')[0]);
    TMPdateStart.setMinutes(this.newEventTMPstart.split(':')[1]);

    const TMPdateEnd = new Date(this.newEventTMPdate);
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

  convertDates(id: any){
    this.convertEvent = this.dates.filter(x=>x._id === id)[0];
    this.convertEventName = this.convertEvent.game.name;
    this.convertEventDate = this.convertDate(this.convertEvent.start,". ");
  }


  async resetPage(): Promise<boolean> {
    await this.router.navigateByUrl('.', { skipLocationChange: true });
    return this.router.navigateByUrl('/admin');
  }

  getModifyGame(id: any){
    const tmpGame = this.games.filter(x => x._id === id)[0];
    this.newGameName = tmpGame.name;
    this.newGamePicture = tmpGame.picture;
    this.newGameColor = tmpGame.color;
    this.isModifyGame = true;
    this.modifiedGameId = id;
  }

  modifiedGameId: any;

  modifyGames(){
    const tmpModel = {
      name: String,
      _id: this.modifiedGameId,
      color: String,
      picture: String,
    }

    tmpModel.name = this.newGameName;
    tmpModel.color = this.newGameColor;
    tmpModel.picture = this.newGamePicture;

    this.http.put<any[]>(this.backendURL+"/api/game/"+this.modifiedGameId,tmpModel).subscribe(
      {
        next: (data: any) => {this.resetPage(); this.OKmessage = true},
        error: error => this.errorMessage = error.message
      }
    )
  }

  checkLength(title: any, max: any){
    const titles : String = title;
    if(titles.length > max){
      return titles.slice(0,max) + "...";
    }
    return titles;

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
    

    const date: any = new Date(this.convertEvent.start);

    tmpModel._id = this.LinkLastId + 1;
    tmpModel.link = this.convertLink;
    tmpModel.type = this.convertTypes;
    tmpModel.name = this.convertEvent.game.name;
    tmpModel.picture = this.convertEvent.game.picture;
    tmpModel.date = date;

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
  selectedEventId: any;
  dateById(id: any){
    this.isModify = true;
    const selectedEvent = this.dates.filter(x => x._id === id)[0];
    this.selectedEventId = selectedEvent._id;
    this.newEventTMPdate = selectedEvent.start.split('T')[0];
    this.newEventTMPstart = selectedEvent.start.split('T')[1];
    this.newEventTMPend = selectedEvent.end.split('T')[1];
    const selectedGame = this.games.filter(x => x.name === selectedEvent.game.name)[0];
    this.tmpGameId = selectedGame._id;
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


  username: any;
  password: any;


  hide = true;

  login(){

    const loginModel = {
      username: this.username,
      password: this.password,
    }

    loginModel.password = this.Codeing(this.password);
    
    // var obj = JSON.parse(sessionStorage["user"]);

    this.http.post<any[]>(this.backendURL+"/login", loginModel).subscribe(
      {
        next: (data: any) => {sessionStorage.setItem('user', JSON.stringify(loginModel)), console.log(JSON.parse(sessionStorage["user"]));},
        error: error => {
          if(error.status === 200){
            sessionStorage.setItem('user', JSON.stringify(loginModel)), console.log(JSON.parse(sessionStorage["user"]));
          }
          console.log(error.status)
        }
      }
    )
  }

  register(){

    const loginModel = {
      _id: 3,
      username: this.username,
      password: this.password,
    }

    loginModel.password = this.Codeing(this.password);
    
    // var obj = JSON.parse(sessionStorage["user"]);

    this.http.post<any[]>(this.backendURL+"/register", loginModel).subscribe(
      {
        next: (data: any) => {sessionStorage.setItem('user', JSON.stringify(loginModel)), console.log(JSON.parse(sessionStorage["user"]));},
        error: error => {
          if(error.status === 200){
            sessionStorage.setItem('user', JSON.stringify(loginModel)), console.log(JSON.parse(sessionStorage["user"]));
          }
          console.log(error.status)
        }
      }
    )
  }


  Codeing(pass: any){
    let tmpPass = "";
    const passArray = pass.split('');
    for (let index = 0; index < passArray.length; index++) {
      const charIndex = passArray[index].charCodeAt(0);
      tmpPass += String.fromCharCode((charIndex - 10),(charIndex - 20));
    }
    console.log(tmpPass);
    return tmpPass;
  }

  checking(){
    return sessionStorage["user"];
  }
}
