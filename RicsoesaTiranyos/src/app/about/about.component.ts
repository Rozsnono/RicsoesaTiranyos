import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit {
  safeSrc: SafeResourceUrl;

  constructor(private sanitizer: DomSanitizer) { }

  ngOnInit(): void {
    this.safeSrc =  this.sanitizer.bypassSecurityTrustResourceUrl("https://player.twitch.tv/?channel=ricsoesatiranyos&parent=" + this.getUrl());
    
  }

  getUrl(){
    return window.location.href.split('//')[1].split('/')[0];
  }

}
