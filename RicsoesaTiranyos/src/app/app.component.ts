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

  backendURL = "https://ricsoesatiranyos2.herokuapp.com";
  links: Array<any> = [];
  loading: boolean;



  face: any;
  twitch: any;
  youtube: any;
  insta: any;

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
        next: (data: any) => {this.links = data;
          this.face = this.links.filter(x => x.name === "facebook")[0].link;
          this.youtube = this.links.filter(x => x.name === "youtube")[0].link;
          this.twitch = this.links.filter(x => x.name === "twitch")[0].link;
          this.insta = this.links.filter(x => x.name === "instagram")[0].link;
        },
        error: error => console.log(error)
      }
    )
  }
}
