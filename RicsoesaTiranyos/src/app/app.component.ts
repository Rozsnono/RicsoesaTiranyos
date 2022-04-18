import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'RicsoesaTiranyos';

  backendURL = "https://ricsoesatiranyos.herokuapp.com";
  links: Array<any> = [];

  constructor(private http: HttpClient){}

  ngOnInit(){
  }

}
