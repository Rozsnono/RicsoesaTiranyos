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

  machines: Array<any>= [];
  displayedColumns = ["specs","type"];
  machinesCount: any;

  isLoaded: any = false;

  ngOnInit(): void {
    this.getSpecs();
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
