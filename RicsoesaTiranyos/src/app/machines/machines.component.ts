import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-machines',
  templateUrl: './machines.component.html',
  styleUrls: ['./machines.component.css']
})
export class MachinesComponent implements OnInit {

  constructor(private http: HttpClient) { }
  backendURL = "https://ricsoesatiranyos2.herokuapp.com";

  pages: any = [];

  ngOnInit(): void {
    this.getPages();
  }

  getPages(){
    this.http.get<any[]>(this.backendURL+"/api/pages").subscribe(
      {
        next: (data: any) => {this.pages = data;},
        error: error => {console.log(error);}
      }
    )
  }

  

  savePages(){
    for (let index = 0; index < this.pages.length; index++) {
      this.http.put<any[]>(this.backendURL+"/api/pages/" + this.pages[index]._id, this.pages[index]).subscribe(
        {
          next: (data: any) => {console.log("OK");},
          error: error => {console.log(error); console.log(this.pages[index])}
        }
      );
    }

    // this.pages.forEach(page => {
    //   this.http.put<any[]>(this.backendURL+"/api/page/"+page._id, page).subscribe(
    //     {
    //       next: (data: any) => {console.log("OK");},
    //       error: error => {console.log(error);}
    //     }
    //   );
    // });
  }
}
