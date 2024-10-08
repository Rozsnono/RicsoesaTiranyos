import { HttpClient } from '@angular/common/http';
import { Component, OnInit, Inject} from '@angular/core';
import { CalendarEvent, CalendarView } from 'angular-calendar';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import { Router } from '@angular/router';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import { AmazingTimePickerService } from 'amazing-time-picker';
import { NgxMaterialTimepickerTheme } from 'ngx-material-timepicker';



@Component({
  selector: 'app-page-settings',
  templateUrl: './page-settings.component.html',
  styleUrls: ['./page-settings.component.css']
})
export class PageSettingsComponent implements OnInit {
  backendURL = "https://ricsoesatiranyosbackend.herokuapp.com";
  constructor(private http: HttpClient, private router: Router, private atp: AmazingTimePickerService) { }

  ngOnInit(): void {

    if(!this.checking()){
      window.location.href = "";
    }

    this.getPages();
    this.getLinks();
  }

  links: any[];
  page: any;

  getLinks(){
    this.http.get<any[]>(this.backendURL+"/api/links").subscribe(
      {
        next: (data: any) => {this.links = data;
          this.page = this.links.filter(x => x.name === "page")[0];
        },
        error: error => console.log(error)
      }
    )
  }

  resetCounter(){
    this.page.subs = 0;
    this.http.put<any[]>(this.backendURL+"/api/link/"+this.page._id,this.page).subscribe(
      {
        next: (data: any) => {},
        error: error => {}
      }
    )
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


  async resetPage(): Promise<boolean> {
    await this.router.navigateByUrl('.', { skipLocationChange: true });
    return this.router.navigateByUrl('/admin');
  }



  username: any;
  password: any;


  MatTabSelectedIndex = 0;

  register(){

    const loginModel = {
      _id: 5,
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
    return tmpPass;
  }

  Codeing2(pass: any){
    let tmpPass = "";
    const passArray = pass.split('');

    for (let index = 0; index < passArray.length; index++) {
      const element = passArray[index].charCodeAt(0);
      if(element > 1000){
        tmpPass += "4" + element;
      }else if(element > 100){
        tmpPass += "3" + element;
      }else if(element > 10){
        tmpPass += "2" + element;
      }else {
        tmpPass += "1" + element;
      }
    }

    return tmpPass;
  }

  hide = true;

  Maintenance(){
    this.pages[0].disabled = !this.pages[0].disabled;

      this.http.put<any[]>(this.backendURL+"/api/page/"+this.pages[0]._id,this.pages[0]).subscribe(
        {
          next: (data: any) => {window.location.reload();},
          error: error => this.errorMessage = error.message
        }
      )
  }



}


