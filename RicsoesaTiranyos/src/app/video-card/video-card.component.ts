import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-video-card',
  templateUrl: './video-card.component.html',
  styleUrls: ['./video-card.component.css']
})
export class VideoCardComponent implements OnInit {
  @Input() link: any = {}; // decorate the property with @Input()
  constructor() { }

  ngOnInit(): void {
  }

  PicToBase64(pic: string){
    return "data:image/jpeg;base64," + pic;
  }

  toCorrectTime(time: any){
    const date = new Date(time);
    return date.getFullYear() + ". " + ((date.getMonth()+1) < 10 ? '0' + (date.getMonth()+1) : (date.getMonth()+1)) + ". " + ((date.getDate()) < 10 ? '0' + (date.getDate()) : (date.getDate())) + ".";
  }

}
