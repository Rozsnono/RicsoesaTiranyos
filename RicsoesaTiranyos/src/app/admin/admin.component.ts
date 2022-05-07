import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
  backendURL = "https://ricsoesatiranyosbackend.herokuapp.com";


  constructor(private http: HttpClient) { }

  ngOnInit(): void {
  }


  username: any;
  password: any;


  hide = true;

  login(){

    console.log(this.password);

    const loginModel = {
      username: this.username,
      password: this.Codeing(this.password),
    }

    
    // var obj = JSON.parse(sessionStorage["user"]);

    this.http.post<any[]>(this.backendURL+"/login", loginModel).subscribe(
      {
        next: (data: any) => {sessionStorage.setItem('user', JSON.stringify(loginModel)), console.log(JSON.parse(sessionStorage["user"]));},
        error: error => console.log(error)
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
  }
}
