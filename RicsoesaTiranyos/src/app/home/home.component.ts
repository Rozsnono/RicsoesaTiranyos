import { Component, Inject, OnInit } from '@angular/core';
import { CalendarEvent, CalendarView } from 'angular-calendar';
import { HttpClient } from '@angular/common/http';
import {FormControl, Validators} from '@angular/forms';
import { Router } from '@angular/router';

import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { id } from 'date-fns/locale';

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

  backendURL = "https://ricsoesatiranyos.herokuapp.com";
  link: any = "";
  viewDate: Date = new Date();
  view: CalendarView = CalendarView.Month;
  CalendarView = CalendarView;
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
  
  dialogClose: String = 'none';

  games: any[] = [];
  events: CalendarEvent[] = [];

  time: any;

  newDateDate: any;
  newDateGameId: any;
  newDateId: Number = 0;
  NewGameName: any;
  NewGameColor: any;

  errorMessage: any;

  base64textString: any;

  onUploadChange(evt: any) {
    const file = evt.target.files[0];

    if (file) {
      const reader = new FileReader();

      reader.onload = this.handleReaderLoaded.bind(this);
      reader.readAsBinaryString(file);
    }
  }

  handleReaderLoaded(e: any) {
    this.base64textString = btoa(e.target.result);
    console.log(this.base64textString);
  }

  gameModel: any = {};
  gameId: any;

  
  model = {
    _id: Number,
    date: String,
    game: Number
  }

  getGameIdforSelect(e: any){
    this.model.game = e;
  }

  async newDateAdd(){
    let d = new Date(this.newDateDate);
    this.newDateDate = d.getFullYear() + "-" + ((d.getMonth()+1) < 10 ? '0' +(d.getMonth()+1) : (d.getMonth()+1)) + "-" + ((d.getDate()) < 10 ? '0' +(d.getDate()) : (d.getDate())) + "T" + this.time.toString();
    if(new Date(this.newDateDate) >= new Date()){
      console.log(this.newDateDate);

      console.log(this.newDateGameId);

      
      if(this.newDateGameId == 99){
        await this.newGameAdd();
      }else{
        await this.getGameId(this.newDateGameId);
      }

      console.log(this.events);
      let tmp: any;
      if(this.events.length == 0){
        tmp = 1;
      }else{
        tmp = this.events[this.events.length-1].id;
      }
      let tmpNumber: any = parseInt(tmp)+1;
      this.model._id = tmpNumber;
      this.model.date = this.newDateDate.toString();

      const newModel = {
        _id: Number,
        game: Number,
        date: String
      }

      newModel._id = this.model._id;
      newModel.game = this.model.game;
      newModel.date = this.model.date;
      

      this.http.post(this.backendURL + "/api/date",newModel).subscribe({
        next: (data: any) => {window.location.reload();},
        error: error => {this.errorMessage = true; console.log(error.message);}
      })
    }else{
      this.errorMessage = true;
    }
    
    
  }
  gameAdded: any;
  newGameAdd(){
    const newID = this.games[this.games.length-1]._id+1;

    const model = {
      _id: Number,
      name: String,
      color: String,
      picture: String,
    }

    model._id = newID;
    model.name = this.NewGameName;
    model.color = this.NewGameColor ? this.NewGameColor : "#000";
    model.picture = this.base64textString;

    
    this.http.post(this.backendURL + "/api/game",model).subscribe({
        next: (data: any) => {this.gameAdded = true;},
        error: error => {this.errorMessage = true; console.log(error.message)}
    })

    this.gameId = newID;
  }

  deleteDate(){
    this.http.delete(this.backendURL + "/api/dates/" + this.deleteId)
        .subscribe({
            next: data => {
              window.location.reload();
            },
            error: error => {
                console.error('There was an error!', error);
                if(error.status == 200) window.location.reload();
            }
        });
  }

  deletingGame(id: any){
    this.dialogClose = 'block';
    this.deleteGameId = id;
  }

  deleteGameId: any;

  deleteGame(){
    this.http.delete(this.backendURL + "/api/games/" + this.deleteGameId )
        .subscribe({
            next: data => {
              window.location.reload();
            },
            error: error => {
                console.error('There was an error!', error);
                if(error.status == 200) window.location.reload();
            }
        });
  }

  selectedEvent: any;
  newEvent: any;

  tmpEvent: any;
  tmpEvents: any[] = [];
  tmpDate: any;

  loaded: boolean = false;

  selectedGame: any;
  selectControl = new FormControl('', Validators.required);
  selectFormControl = new FormControl('', Validators.required);

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
          this.loaded = true;
        },
        error: error => console.log(error)
      }
    )
  }

  whichHour(tmpdate: any): string {
    let date = tmpdate.split('T');
    
    return date[0].replaceAll('-','. ') + " " + date[1].split(':')[0] + ":" + date[1].split(':')[2].split('.')[0];
  }

  deleteId: any;


  dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
    this.selectedEvent = null;
    this.newDateDate = date;
    if(events.length != 0){
      this.getDateId(events[0].id);
      this.deleteId = events[0].id;
      this.tmpDate = date.getFullYear() + ". " + (date.getMonth() < 10 ? '0' + date.getMonth() : date.getMonth()) + ". " + (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) + ". " +(date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ":" + (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes());
      this.selectedEvent.date = this.tmpDate;
      
      this.selectedEvent.selected = true;
    }else{
      this.newEvent = true;
    }
    //this.openAppointmentList(date)
  }

  getGame(){
    this.http.get<any[]>(this.backendURL+"/api/games").subscribe(
      {
        next: (data: any) => {this.games = data;console.log(this.games);},
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
        next: (data: any) => {console.log(data); this.gameModel = data; this.model.game = data._id},
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

