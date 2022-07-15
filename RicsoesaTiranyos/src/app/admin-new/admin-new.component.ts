import { HttpClient } from '@angular/common/http';
import { Component, OnInit, Inject} from '@angular/core';
import { CalendarEvent, CalendarView } from 'angular-calendar';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import { Router } from '@angular/router';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import { AmazingTimePickerService } from 'amazing-time-picker';
import { NgxMaterialTimepickerTheme } from 'ngx-material-timepicker';

@Component({
  selector: 'app-admin-new',
  templateUrl: './admin-new.component.html',
  styleUrls: ['./admin-new.component.css']
})
export class AdminNewComponent implements OnInit {
  backendURL = "https://ricsoesatiranyosbackend.herokuapp.com";
  constructor(private http: HttpClient, private router: Router, private atp: AmazingTimePickerService) { }

  ngOnInit(): void {

    if(!this.checking()){
      window.location.href = "";
    }

    this.getDates();
    this.getLinkLastId();
    this.getGames();
    this.getPages();
    this.getAllLink();
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
  pages: any[];

    
  getPages() {
    this.http.get<any[]>(this.backendURL+"/api/pages").subscribe(
      {
        next: (data: any) => {this.pages = data},
        error: error => this.errorMessage = error.message
      }
    )
  }

  modifyPages(){
    for (let index = 0; index < this.pages.length; index++) {
      const element = this.pages[index];
      
      this.http.put<any[]>(this.backendURL+"/api/page/"+element._id,element).subscribe(
        {
          next: (data: any) => {window.location.reload();},
          error: error => this.errorMessage = error.message
        }
      )
    }
    
  }

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

  convertDates(id: any){
    this.convertEvent = this.dates.filter(x=>x._id === id)[0];
    this.convertEventName = this.convertEvent.game.name;
    this.convertEventDate = this.convertDate(this.convertEvent.start,". ");
  }


  async resetPage() {
    window.location.reload();
    // await this.router.navigateByUrl('.', { skipLocationChange: true });
    // return this.router.navigateByUrl('admin/uj');
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

  series: any;

  GameToLink: any;

  YoutubeLinks: any[];

  getAllLink(){
    this.http.get<any[]>(this.backendURL+"/api/youtube").subscribe(
      {
        next: (data: any) => {
          this.YoutubeLinks = data;
        },
        error: error => console.log(error)
      }
    )
  }

  getDataToGame(gameName: any, length: Boolean){
    return this.YoutubeLinks.filter(x => x.name.includes(gameName)).length === 0 ? 0 : length ? this.YoutubeLinks.filter(x => x.name.includes(gameName)).length : this.YoutubeLinks.filter(x => x.name.includes(gameName))[0].running;
  }

  getRunningGame(gameId: any){
    if (!gameId){
      return false
    }
    else if(this.YoutubeLinks.filter(x => x.name.includes(this.games.filter(x => x._id === gameId)[0].name)).length === 0){
      return false
    }
    return gameId ? this.YoutubeLinks.filter(x => x.name.includes(this.games.filter(x => x._id === gameId)[0].name))[0].running : false;
  }

  checkChange(e: any){
    console.log(this.YoutubeLinks.filter(x => x.name.includes(this.games.filter(x => x._id === e)[0].name))[0]);
    try {
      if(this.YoutubeLinks.filter(x => x.name.includes(this.games.filter(x => x._id === e)[0].name))[0].running){
        this.convertTypes = this.YoutubeLinks.filter(x => x.name.includes(this.games.filter(x => x._id === e)[0].name))[0].type;
        this.convertLink = this.YoutubeLinks.filter(x => x.name.includes(this.games.filter(x => x._id === e)[0].name))[0].link;
        this.newLinkDate = this.YoutubeLinks.filter(x => x.name.includes(this.games.filter(x => x._id === e)[0].name))[0].date;
        this.modifyLinkId = this.YoutubeLinks.filter(x => x.name.includes(this.games.filter(x => x._id === e)[0].name))[0]._id;
      }else{
        this.convertTypes = [];
        this.convertLink = "";
        this.newLinkDate = "";
      }
    } catch (error) {
      this.convertTypes = [];
      this.convertLink = "";
      this.newLinkDate = "";
    }
    
  }

  modifyLinkId: any;

  newLinkDate: any;

  saveLink(){
    const tmpModel = {
      _id: Number,
      link: String,
      name: String,
      picture: String,
      type: Array,
      date: String,
      running: Boolean
    }
    

    const game: any = this.games.filter(x => x._id === this.GameToLink)[0];

    const date: any = new Date(this.newLinkDate);
    const running: any = true;

    tmpModel._id = this.LinkLastId + 1;
    tmpModel.link = this.convertLink;
    tmpModel.type = this.convertTypes;
    tmpModel.name = game.name;
    tmpModel.picture = game.picture;
    tmpModel.date = date;
    tmpModel.running = running;

    this.http.post<any[]>(this.backendURL+"/api/youtube",tmpModel).subscribe(
      {
        next: (data: any) => {this.OKmessage = true;},
        error: error => this.errorMessage = error.message
      }
    )
  }

  modifyLink(){
    const tmpModel = {
      _id: Number,
      link: String,
      name: String,
      picture: String,
      type: Array,
      date: String,
      running: Boolean
    }
    

    const game: any = this.games.filter(x => x._id === this.GameToLink)[0];

    const date: any = new Date();
    const running: any = !this.series;

    tmpModel.link = this.convertLink;
    tmpModel.type = this.convertTypes;
    tmpModel.name = game.name;
    tmpModel.picture = game.picture;
    tmpModel.date = date;
    tmpModel.running = running;

    this.http.put<any[]>(this.backendURL+"/api/youtube/" + this.modifyLinkId,tmpModel).subscribe(
      {
        next: (data: any) => {this.OKmessage = true;},
        error: error => this.errorMessage = error.message
      }
    )
  }


  endOfSeries(){
    this.series = true;
    this.modifyLink();
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
        next: (data: any) => {this.games.push(data); this.OKmessage = true; this.resetPage()},
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

    this.MatTabSelectedIndex = 0;
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
  links: any[];
  getLinkLastId(): any{
    this.http.get<any[]>(this.backendURL+"/api/youtube").subscribe(
      {
        next: (data: any) => {
          this.links = data;
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


  MatTabSelectedIndex = 0;

  gamePicture(pic: string){
    return "data:image/jpeg;base64," + pic;
  }
  
}


