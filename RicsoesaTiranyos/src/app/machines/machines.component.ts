import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-machines',
  templateUrl: './machines.component.html',
  styleUrls: ['./machines.component.css']
})
export class MachinesComponent implements OnInit {

  constructor() { }

  machines = {type:"PC", specs: [["Videókártya", "RTX 3090"],["Processzor", "Intel i9 9900k"]]};
  displayedColumns = ["specs","type"]

  ngOnInit(): void {
  }

}
