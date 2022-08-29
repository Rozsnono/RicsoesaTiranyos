import { HttpClient } from '@angular/common/http';
import { Component, OnInit, Inject} from '@angular/core';
import { CalendarEvent, CalendarView } from 'angular-calendar';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import { Router } from '@angular/router';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import { AmazingTimePickerService } from 'amazing-time-picker';
import { NgxMaterialTimepickerTheme } from 'ngx-material-timepicker';

@Component({
  selector: 'app-series',
  templateUrl: './series.component.html',
  styleUrls: ['./series.component.css']
})
export class SeriesComponent implements OnInit {
  backendURL = "https://ricsoesatiranyosbackend.herokuapp.com";
  constructor(private http: HttpClient, private router: Router, private atp: AmazingTimePickerService) { }

  ngOnInit(): void {

    if(!this.checking()){
      window.location.href = "";
    }

    this.getLinkLastId();
    this.getGames();
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
  convertingTitle: any;
  convertingPic: any;
  convertLink: any;
  convertTypes: any = [];
  convertEvent: any;
  convertEventName: any;
  convertEventDate: any;
  convertingDate: any = new Date();

  optionalTitle: boolean = true;
  optionalPic: boolean = true;

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

    console.log(e);

    const choosenGame = this.games.filter(x => x._id === e);
    this.convertingTitle = choosenGame[0].name;
    this.convertingPic = choosenGame[0].picture;



    // console.log(this.YoutubeLinks.filter(x => x.name.includes(this.games.filter(x => x._id === e)[0].name))[0]);
    // try {
    //   if(this.YoutubeLinks.filter(x => x.name.includes(this.games.filter(x => x._id === e)[0].name))[0].running){
    //     this.convertTypes = this.YoutubeLinks.filter(x => x.name.includes(this.games.filter(x => x._id === e)[0].name))[0].type;
    //     this.convertLink = this.YoutubeLinks.filter(x => x.name.includes(this.games.filter(x => x._id === e)[0].name))[0].link;
    //     this.newLinkDate = this.YoutubeLinks.filter(x => x.name.includes(this.games.filter(x => x._id === e)[0].name))[0].date;
    //     this.modifyLinkId = this.YoutubeLinks.filter(x => x.name.includes(this.games.filter(x => x._id === e)[0].name))[0]._id;
    //   }else{
    //     this.convertTypes = [];
    //     this.convertLink = "";
    //     this.newLinkDate = "";
    //   }
    // } catch (error) {
    //   this.convertTypes = [];
    //   this.convertLink = "";
    //   this.newLinkDate = "";
    // }

  }

  getModifyLink(id: any){
    const choosenLink = this.YoutubeLinks.filter(x => x._id === id)[0];

    this.convertTypes = choosenLink.type;
    this.convertLink = choosenLink.link;
    this.newLinkDate = choosenLink.date;
    this.modifyLinkId = choosenLink._id;
    this.convertingTitle = choosenLink.name;
    this.convertingPic = choosenLink.picture;

    this.isModify = id;
  }

  cancelModification(){
    this.convertTypes = null;
    this.convertLink = null;
    this.newLinkDate = null;
    this.modifyLinkId = null;
    this.convertingTitle = null;
    this.convertingPic = null;

    this.isModify = null;
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

    const date: any = new Date(this.newLinkDate);
    const running: any = true;

    tmpModel._id = this.LinkLastId + 1;
    tmpModel.link = this.convertLink;
    tmpModel.type = this.convertTypes;
    tmpModel.name =  this.convertingTitle;
    tmpModel.picture = this.convertingPic;
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

    const date: any = new Date();
    const running: any = !this.series;

    tmpModel.link = this.convertLink;
    tmpModel.type = this.convertTypes;
    tmpModel.name =  this.convertingTitle;
    tmpModel.picture = this.convertingPic;
    tmpModel.date = this.newLinkDate;
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

  LetsEndOfSeries(link: any){
    link.running = false;
    this.http.put<any[]>(this.backendURL+"/api/youtube/" + link._id,link).subscribe(
      {
        next: (data: any) => {this.OKmessage = true;},
        error: error => this.errorMessage = error.message
      }
    )
  }

  LetsReloadTheSeries(link: any){
    link.running = true;
    this.http.put<any[]>(this.backendURL+"/api/youtube/" + link._id,link).subscribe(
      {
        next: (data: any) => {this.OKmessage = true;},
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

  onUploadChange(evt: any) {
    const file = evt.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = this.handleReaderLoaded.bind(this);
      reader.readAsBinaryString(file);
    }
  }

  handleReaderLoaded(e: any) {
    this.convertingPic = btoa(e.target.result);
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



