import { HttpClient } from '@angular/common/http';
import { Component, OnInit, Inject} from '@angular/core';
import { CalendarEvent, CalendarView } from 'angular-calendar';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import { Router } from '@angular/router';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import { AmazingTimePickerService } from 'amazing-time-picker';
import { NgxMaterialTimepickerTheme } from 'ngx-material-timepicker';

@Component({
  selector: 'app-games',
  templateUrl: './games.component.html',
  styleUrls: ['./games.component.css']
})
export class GamesComponent implements OnInit {
  backendURL = "https://ricsoesatiranyosbackend.herokuapp.com";
  constructor(private http: HttpClient, private router: Router, private atp: AmazingTimePickerService) { }

  ngOnInit(): void {

    if(!this.checking()){
      window.location.href = "";
    }

    this.getGames();

  }


  checking(){
    return sessionStorage["user"];
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
  pages: any[];



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

  modifyLinkId: any;

  newLinkDate: any;

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

  handleReaderLoaded(e: any) {
    this.newGamePicture = btoa(e.target.result);
  }

  getGameIdforSelect(e: any){
    this.newEventTMPgame = e;
  }


  getGameLastId(): any{
    let max:any = 0;
    this.games.forEach(element => {
      max = element._id > max ? element._id : max;
    });

    return parseFloat(max)+1;
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

  gamePicture(pic: string){
    return "data:image/jpeg;base64," + pic;
  }

}


