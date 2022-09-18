import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';


@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit {
  constructor(private http: HttpClient,private router: Router) { }

  backendURL = "https://ricsoesatiranyosbackend.herokuapp.com";
  isMobile:boolean;


  ngOnInit(): void {
    this.getRoute();
    this.getLinks();
    sessionStorage.clear();

    if(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)){
      // true for mobile device
      this.isMobile = true;
      this.router.navigateByUrl('/not-found');
    }else{
      // false for not mobile device
      this.isMobile = false;
    }
  }

  getRoute(){
    this.http.get<any[]>(this.backendURL+"/api/pages").subscribe(
      {
        next: (data: any[]) => {
          if(data.filter(x => x.route === "rolunk")[0].disabled){
            this.router.navigateByUrl('/not-found');
          }else{
          }

        },
        error: error => console.log(error)
      }
    )
  }

  links: any[] = [];

  getLinks(){
    this.http.get<any[]>(this.backendURL+"/api/links").subscribe(
      {
        next: (data: any) => {this.links = data;},
        error: error => console.log(error)
      }
    )
  }

  getLinkByName(name: any){
    if(name === "high"){
      return "https://www.youtube.com/channel/UC4x9Z4hBYFKuoqBFI6qRbAQ";
    }
    return this.links.filter(x => x.name === name)[0].link;
  }

}
