import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-new-home',
  templateUrl: './new-home.component.html',
  styleUrls: ['./new-home.component.css']
})
export class NewHomeComponent implements OnInit {

  @Input() name: any = {};
  @Input() class: any = {};
  @Input() src: any = {};
  @Input() width: any = {};
  @Input() routerlink: any = {};

  constructor() { }

  ngOnInit(): void {
  }
}
