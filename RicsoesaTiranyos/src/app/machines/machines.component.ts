import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-machines',
  templateUrl: './machines.component.html',
  styleUrls: ['./machines.component.css']
})
export class MachinesComponent implements OnInit {

  constructor(private http: HttpClient) { }
  backendURL = "https://ricsoesatiranyos.herokuapp.com";

  machines: Array<any>= [];
  displayedColumns = ["specs","type", "buttons"];

  newSpecType: any;
  newSpecDetails: any;

  ngOnInit(): void {
    this.getSpecs();

    
  }

  modifySpecs(id: any, machinesId: any){
    const model = this.machines[machinesId-1];
    let tmpArray = model.specs;

    let stmpArray = [];

    for (let index = 0; index < tmpArray.length; index++) {
      if(tmpArray[index][0] != id) stmpArray.push(tmpArray[index])
    }
    model.specs = stmpArray;


    this.http.put<any[]>(this.backendURL+"/api/machine/"+machinesId,model).subscribe(
      {
        next: (data: any) => {this.machines = data;window.location.reload();},
        error: error => {console.log(error); window.location.reload();}
      }
    )
  }

  createSpecs(machinesId: any){
    const model = this.machines[machinesId-1];
    let tmpArray = model.specs;
    let sTmpArray = [this.getSpecsNewID(machinesId),this.newSpecType, this.newSpecDetails];
    tmpArray.push(sTmpArray);
    model.specs = tmpArray;

    this.http.put<any[]>(this.backendURL+"/api/machine/"+machinesId,model).subscribe(
      {
        next: (data: any) => {this.machines = data; window.location.reload();},
        error: error => {console.log(error); window.location.reload();}
      }
    )
  }

  getSpecsNewID(machinesId: any){
    const tmpArray = this.machines[machinesId-1].specs;
    let max = 0;
    for (let index = 0; index < tmpArray.length; index++) {
      max =  tmpArray[index][0] < max ? max :  tmpArray[index][0];
    }
    return parseInt(max.toString())+1;
  }

  getSpecs(){
    this.http.get<any[]>(this.backendURL+"/api/machines").subscribe(
      {
        next: (data: any) => {this.machines = data;},
        error: error => console.log(error)
      }
    )

    
  }

}
