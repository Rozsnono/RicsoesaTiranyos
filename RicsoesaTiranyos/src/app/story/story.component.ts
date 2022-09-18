import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-story',
  templateUrl: './story.component.html',
  styleUrls: ['./story.component.css']
})
export class StoryComponent implements OnInit {

  @Input() name: any = "";
  @Input() picture: any = "";
  @Input() iconSRC: any = "";
  @Input() link: any = "";

  constructor() { }

  ngOnInit(): void {
  }

  goTo(){
    window.location.href = this.link;
  }

  toBase64(){
    return "data:image/jpeg;base64," + this.picture;
  }

  nameLengthCheck(length: any = 16){
    return this.name.slice(0, length)
  }
}
