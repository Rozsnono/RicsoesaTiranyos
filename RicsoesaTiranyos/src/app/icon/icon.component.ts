import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-icon',
  templateUrl: './icon.component.html',
  styleUrls: ['./icon.component.css']
})
export class IconComponent implements OnInit {

  @Input() svg: any = {};
  @Input() class: any = {};
  @Input() number: any = {};
  @Input() link: any = {};

  constructor() { }

  ngOnInit(): void {
  }

  goTo(){
    window.location.href = this.link;
  }

}
