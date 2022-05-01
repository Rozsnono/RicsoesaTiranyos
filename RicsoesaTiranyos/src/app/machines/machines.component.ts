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
      const tmpModel = {
        disabled: this.pages[index].disabled,
        title: this.pages[index].title,
        route: this.pages[index].route,
        name: this.pages[index].name,
      }


      this.http.put<any[]>("https://ricsoesatiranyos2.herokuapp.com/api/page/" + this.pages[index]._id, tmpModel).subscribe(
        {
          next: (data: any) => { window.location.reload() },
          error: error => {console.log(error);}
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
