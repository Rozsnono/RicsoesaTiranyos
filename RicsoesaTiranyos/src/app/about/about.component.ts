import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit {
  constructor(private http: HttpClient) { }

  backendURL = "https://ricsoesatiranyos2.herokuapp.com";

  ngOnInit(): void {
    this.getLinks();
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
    return this.links.filter(x => x.name === name)[0].link;
  }
  
}
