import { HttpClient } from '@angular/common/http';
import { Component, OnInit, Inject} from '@angular/core';
import { CalendarEvent, CalendarView } from 'angular-calendar';
import {FormControl, Validators} from '@angular/forms';
import { Router } from '@angular/router';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import { AmazingTimePickerService } from 'amazing-time-picker';
import { NgxMaterialTimepickerTheme } from 'ngx-material-timepicker';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
  backendURL = "https://ricsoesatiranyosbackend.herokuapp.com";
  constructor(private http: HttpClient, private router: Router, private atp: AmazingTimePickerService) { }

  ngOnInit(): void {
  }

  username: any;
  password: any;

  error: boolean = false;


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
        next: (data: any) => {
          sessionStorage.setItem('user', JSON.stringify(loginModel)), console.log(JSON.parse(sessionStorage["user"]));
          window.location.href = "admin/uj";
          this.error = false;
        },
        error: error => {
          if(error.status === 200){
            this.error = false;
            sessionStorage.setItem('user', JSON.stringify(loginModel)), console.log(JSON.parse(sessionStorage["user"]));
            window.location.href = "admin/uj";
          }else{
            this.error = true;
          }
          console.log(error);
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
    return tmpPass;
  }

  Coding2(pass: any){
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
  }


  checking(){
    return sessionStorage["user"];
  }
}
