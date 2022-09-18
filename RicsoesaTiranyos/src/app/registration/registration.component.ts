import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit {

  @Input() title: any = "";
  @Input() titleSRC: any = "";
  @Input() titleWIDTH: any = 50;
  @Input() html: any = "";
  @Input() videoType: any;
  @Input() img: any = "";

  @Input() btn1: any = "";
  @Input() btn1link: any = "";
  @Input() btn1Icon: any = {};

  @Input() btn2: any = "";
  @Input() btn2link: any = "";
  @Input() btn2Icon: any = {};

  @Input() btn3: any = "";
  @Input() btn3link: any = "";
  @Input() btn3Icon: any = {};

  constructor() { }

  ngOnInit(): void {
  }

  goTo(link: any){
    window.location.href = link;
  }

}
