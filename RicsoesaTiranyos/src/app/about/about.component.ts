import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit {
  safeSrc: SafeResourceUrl;
  backendURL = "https://ricsoesatiranyos2.herokuapp.com";

  youtubeURL: SafeResourceUrl;
  twitchURL: SafeResourceUrl;
  instagramURL: SafeResourceUrl;

  youtube: String;
  twitch: String;
  instagram: String;

  nextStream: any = {};

  months: any = [
    "Január","Február","Március","Április","Május","Június","Július","Augusztus","Szeptember","Október","November","December"
  ]

  convertToDateMonth(d: any, type: any = "3"): string{
    const date = new Date(d);
    if(type==="full"){
      return this.months[date.getMonth()];
    }
    return this.months[date.getMonth()].slice(0,3);
  }
  convertToDateYear(d: any): string{
    const date = new Date(d);
    return date.getFullYear () + ".";
  }
  convertToDate(d: any): string{
    const date = new Date(d);
    return date.getDate() + ".";
  }
  convertToTime(d: any): string {
    const date = new Date(d);
    return (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ":" + (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes());
  }

  links: any[] = [];

  constructor(private sanitizer: DomSanitizer, private http: HttpClient) { }

  ngOnInit(): void {
    this.getSubs();
    this.getStream();

    this.safeSrc =  this.sanitizer.bypassSecurityTrustResourceUrl("https://player.twitch.tv/?channel=ricsoesatiranyos&parent=" + this.getUrl());
  }

  getUrl(){
    if(window.location.href.includes("localhost")){
      return "localhost";
    }
    return window.location.href.split('//')[1].split('/')[0];
  }

  getSubs(){
    this.http.get<any[]>(this.backendURL+"/api/links").subscribe(
      {
        next: (data: any) => 
          {
            this.links = data; this.youtubeURL = this.getLinkByName("youtube"); this.twitchURL = this.getLinkByName("twitch"); this.instagramURL = this.getLinkByName("instagram");
            this.youtube = this.subConverter("youtube",data);
            this.twitch = this.subConverter("twitch",data);
            this.instagram = this.subConverter("instagram",data);
          },
        error: error => console.log(error)
      }
    )
  }

  getStream(){
    this.http.get<any[]>(this.backendURL+"/api/futureDates").subscribe(
      {
        next: (data: any) => 
          {
            this.nextStream = data[0];
            
          },
        error: error => console.log(error)
      }
    )
  }

  subConverter(type: any, data: any[]): String{
    const tmp:any = data.filter(x => x.name === type);
    const subs = tmp[0].subs.toString();

    if(parseInt(subs) > 100000){
      const sub = subs.slice();
      return sub[0]+sub[1]+sub[2] + "k+";
    }

    if(parseInt(subs) > 1000){
      const sub = subs;
      let subIn = "";
      let finalSubs = "";
      for (let index = sub.length-1; index >= 0; index--) {
        subIn += ((sub.length-1 - index) % 3 == 0 ? " ": "") + sub[index];
      }

      for (let index = subIn.length-1; index >= 0; index--) {
        finalSubs += subIn[index];
      }
      
      return finalSubs;
    }


    return subs;
  }

  getLinkByName(type: any):any{
    const tmp: any = this.links.filter(x => x.name === type)[0];
    return tmp.link;
  }

}
