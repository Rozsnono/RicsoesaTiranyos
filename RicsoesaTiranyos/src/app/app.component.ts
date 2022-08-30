import { HttpClient } from '@angular/common/http';
import { Component, HostListener, Inject } from '@angular/core';
import { Router, NavigationStart, NavigationEnd } from '@angular/router';
import { DOCUMENT } from '@angular/common';
import {filter} from 'rxjs/operators';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'RicsoesaTiranyos';

  backendURL = "https://ricsoesatiranyosbackend.herokuapp.com";
  isMobile:boolean;


  none: any;
  aboutNone: any;

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


  page: any;

  logos = [
    "",
    "fa-regular fa-address-card",
    "fa-solid fa-calendar-day",
    "fa-solid fa-computer",
    "fa-solid fa-film"
  ];

  icons = [
    "bi-house",
    "bi-people",
    "bi-table",
    "bi-pc-display",
    "bi-grid"
  ]

  pages: any = [];

  constructor(private http: HttpClient, private router: Router, @Inject(DOCUMENT) private dom: Document){
  }

  ngOnInit(){

    this.getLinks();
    this.getPages();

    this.router.events.subscribe((url:any) => {
      url.url === undefined ? "" :
      this.none = url.url === "/" ? "" : "none";
      url.url === undefined ? "" :
      this.aboutNone = url.url === "/" ? "" : "aboutNone";
    });

    if(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)){
      // true for mobile device
      this.isMobile = true;
    }else{
      // false for not mobile device
      this.isMobile = false;
    }
  }

  maintenance: any;

  getLinks(){
    this.http.get<any[]>(this.backendURL+"/api/links").subscribe(
      {
        next: (data: any) => {this.links = data;
          this.page = this.links.filter(x => x.name === "page")[0];
          this.loading = false;
        },
        error: error => console.log(error)
      }
    )
  }



  getPages(){
    this.http.get<any[]>(this.backendURL+"/api/pages").subscribe(
      {
        next: (data: any) =>{
          this.pages = data;
          for (let index = 0; index < this.pages.length; index++) {
            this.pages[index].icon = this.icons[index];
          }
        },
        error: error => console.log(error)
      }
    )
  }

  checkMaintenance(){

    if(this.isMobile){
      return true;
    }

    if(this.router.url === "/login" || this.router.url === "/admin/oldal" || this.router.url === "/admin/uj"){
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

  checkRoute(route: any){
    if (this.router.url.split('/')[1] === route) {
      return "activatedHome";
    }
    return "notActive"
  }

}
