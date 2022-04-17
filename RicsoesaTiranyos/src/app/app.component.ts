import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router, NavigationStart, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'RicsoesaTiranyos';

  backendURL = "https://ricsoesatiranyos.herokuapp.com";
  links: Array<any> = [];
  loading: boolean;

  constructor(private http: HttpClient, private router: Router){
    router.events.subscribe(event => {
      if(event instanceof NavigationStart) {
        this.loading = true;
      }else if(event instanceof NavigationEnd) {
        this.loading = false;
      }
    });
  }

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
