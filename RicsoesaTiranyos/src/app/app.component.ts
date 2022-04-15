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
    this.getLinks();
  }

  getLinks(){
    this.http.get<any[]>(this.backendURL+"/api/links").subscribe(
      {
        next: (data: any) => {this.links = data;},
        error: error => console.log(error)
      }
    )
  }
}
