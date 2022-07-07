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

  backendURL = "https://ricsoesatiranyosbackend.herokuapp.com";

  currentRoute: string;

  links: Array<any> = [];
  loading: boolean = true;

  windowScrolled: boolean;

  @HostListener("window:scroll", []) onWindowScroll() {
    if (window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop > 100) {
        this.windowScrolled = true;
    } 
    else if (this.windowScrolled && window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop < 10) {
        this.windowScrolled = false;
    }
}


  tiktok: any;
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
  }

  ngOnInit(){
    this.getLinks();
    this.getPages();
  }

  maintenance: any;

  getLinks(){
    this.http.get<any[]>(this.backendURL+"/api/links").subscribe(
      {
        next: (data: any) => {this.links = data;
          this.tiktok = this.links.filter(x => x.name === "tiktok")[0].link;
          this.youtube = this.links.filter(x => x.name === "youtube")[0].link;
          this.twitch = this.links.filter(x => x.name === "twitch")[0].link;
          this.insta = this.links.filter(x => x.name === "instagram")[0].link;
          this.loading = false;
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

  checkMaintenance(){
    if(this.router.url === "/admin" || this.router.url === "/admin/oldal" || this.router.url === "/admin/uj"){
      return false;
    }

    for (let index = 0; index < this.pages.length; index++) {
      const element = this.pages[index];
      if(element.name === "home") {return element.disabled;}
    }
  }

  signOut(){
    sessionStorage.clear();
  }

  scroll(){
    this.dom.body.scrollTop =0;
    this.dom.documentElement.scrollTop=0;
  }

  checking(){
    return sessionStorage["user"];
  }

  
}
