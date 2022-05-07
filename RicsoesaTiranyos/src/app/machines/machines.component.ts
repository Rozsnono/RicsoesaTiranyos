import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-machines',
  templateUrl: './machines.component.html',
  styleUrls: ['./machines.component.css']
})
export class MachinesComponent implements OnInit {

  constructor(private http: HttpClient,private router: Router) { }
  backendURL = "https://ricsoesatiranyosbackend.herokuapp.com";


  machines: Array<any>= [];
  displayedColumns = ["specs","type"];
  machinesCount: any;

  isLoaded: any = false;

  ngOnInit(): void {
    this.getSpecs();
    this.getRoute();
  }

  getRoute(){
    this.http.get<any[]>(this.backendURL+"/api/pages").subscribe(
      {
        next: (data: any[]) => {
          if(data.filter(x => x.route === "gepeink")[0].disabled){
            this.router.navigateByUrl('/not-found');
          }else{
          }

        },
        error: error => console.log(error)
      }
    )
  }

  

  getSpecs(){
    this.http.get<any[]>(this.backendURL+"/api/machines").subscribe(
      {
        next: (data: any) => {this.machines = data; this.machinesCount = data.length; this.isLoaded = true},
        error: error => console.log(error)
      }
    )
  }

  gamePicture(pic: string){
    switch (pic) {
      case "Patrik":
        return "../../assets/patrikmachine.png";
        break;
      case "Bence":
        return "../../assets/bencemachine.png";
        break;
      case "Norbi":
        return "../../assets/nonomachine.png";     
        break;  
      default:
        return "";
        break;
    } 
  }

}
