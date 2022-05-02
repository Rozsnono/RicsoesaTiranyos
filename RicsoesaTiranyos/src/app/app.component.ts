import { HttpClient } from '@angular/common/http';
import { Component, HostListener, Inject } from '@angular/core';
import { Router, NavigationStart, NavigationEnd } from '@angular/router';
import { DOCUMENT } from '@angular/common';

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

  windowScrolled: boolean;

  @HostListener("window:scroll", []) onWindowScroll() {
    if (window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop > 100) {
        this.windowScrolled = true;
    } 
    else if (this.windowScrolled && window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop < 10) {
        this.windowScrolled = false;
    }
}


  face: any;
  twitch: any;
  youtube: any;
  insta: any;

  logos = [
    "",
    "fa-regular fa-address-card",
    "fa-solid fa-calendar-day",
    "fa-solid fa-computer",
    "fa-solid fa-film"
  ];

  pages: any = [];

  constructor(private http: HttpClient, private router: Router, @Inject(DOCUMENT) private dom: Document){
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
    this.getPages();
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

  getPages(){
    this.http.get<any[]>(this.backendURL+"/api/pages").subscribe(
      {
        next: (data: any) => {this.pages = data;},
        error: error => console.log(error)
      }
    )
  }

  scroll(){
    this.dom.body.scrollTop =0;
    this.dom.documentElement.scrollTop=0;
  }
}
