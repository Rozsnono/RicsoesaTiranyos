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
  displayedColumns = ["specs","type"];
  machinesCount: any;

  ngOnInit(): void {
    this.getSpecs();
  }

  getSpecs(){
    this.http.get<any[]>(this.backendURL+"/api/machines").subscribe(
      {
        next: (data: any) => {this.machines = data; this.machinesCount = data.length},
        error: error => console.log(error)
      }
    )

    
  }

}
