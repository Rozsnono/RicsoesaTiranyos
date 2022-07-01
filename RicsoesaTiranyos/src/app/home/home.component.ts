import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})


export class HomeComponent implements OnInit {

  safeSrc: SafeResourceUrl;
  backendURL = "https://ricsoesatiranyosbackend.herokuapp.com";

  youtubeURL: SafeResourceUrl;
  twitchURL: SafeResourceUrl;
  instagramURL: SafeResourceUrl;

  readyCounter: any = 0;

  youtube: String;
  twitch: String;
  instagram: String;

  nextStream: any = [];

  months: any = [
    "Január","Február","Március","Április","Május","Június","Július","Augusztus","Szeptember","Október","November","December"
  ]

  

  goToYoutube(){
    window.location.href = "https://www.youtube.com/channel/UCVxPnFAKMyWtvxodKjg5L2w";
  }

  convertToDateMonth(d: any, type: any = "3"): string{
    try {
      const date = new Date(d);
      if(type==="full"){
        return this.months[date.getMonth()];
      }
      return this.months[date.getMonth()].slice(0,3);
    } catch (error) {
      return "";
    }

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

  getNextStreamName(){
    try {
      return this.nextStream.game.name;
    } catch (error) {
      return "";
    }
  }

  links: any[] = [];
  video: any;
  twitchSubsLink: any;
  isMobile: boolean;

  constructor(private sanitizer: DomSanitizer, private http: HttpClient) { }

  ngOnInit(): void {
    document.body.style.overflow = "hidden";
    if(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)){
      // true for mobile device
      this.isMobile = true;
    }else{
      // false for not mobile device
      this.isMobile = false;
    }
    sessionStorage.clear();
    this.getStream();
    this.getAuthFromTwitch();
    this.getYoutubeSubs();
    this.getVideos();
    this.safeSrc =  this.sanitizer.bypassSecurityTrustResourceUrl("https://player.twitch.tv/?channel=ricsoesatiranyos&parent=www.ricsoesatiranyos.hu");
  }

  getVideos(){
    this.http.get<any[]>(this.backendURL+"/api/youtube").subscribe(
      {
        next: (data: any) => {this.video = data[0];},
        error: error => console.log(error)
      }
    )
  }

  getUrl(){
    if(window.location.href.includes("localhost")){
      return "localhost";
    }
    if(window.location.href.includes("www")){
      return "ricsoesatiranyos.hu";
    }
    if(window.location.href.includes("ricsoesatiranyos")){
      return "ricsoesatiranyos.hu";
    }
    return window.location.href.split('//')[1].split('/')[0];
  }

  authToken: any;

  getAuthFromTwitch(){
    const model = {
      client_id: "hpb1bshobiw3k31pmu78v3c1wnyqos",
      client_secret:"jt0mixedykuf57n384qz9yijzwlfzl",
      grant_type:"client_credentials"
    }

    this.http.post<any[]>("https://id.twitch.tv/oauth2/token?client_id=hpb1bshobiw3k31pmu78v3c1wnyqos&client_secret=jt0mixedykuf57n384qz9yijzwlfzl&grant_type=client_credentials",model).subscribe(
      {
        next: (data: any) =>
          {
            this.authToken = data.access_token;
            this.readyCounter += 1;
            this.getSubsFromTwitch();
            document.body.style.overflow = this.readyCounter == 4 ? "visible" : "hidden";

          },
        error: error => console.log(error)
      }
    )
  }

  getSubsFromTwitch(){
    const headers = new HttpHeaders()
    .set('Authorization', "Bearer " + this.authToken)
    .set('client-id','hpb1bshobiw3k31pmu78v3c1wnyqos');

    this.http.get<any[]>("https://api.twitch.tv/helix/users/follows?to_id=777755687",{"headers":headers}).subscribe(
      {
        next: (data: any) =>
          {
            this.readyCounter += 1;
            this.twitch = this.subConverter("twitch",data.total);
            document.body.style.overflow = this.readyCounter == 4 ? "visible" : "hidden";
          },
        error: error => console.log(error)
      }
    )
  }


  getYoutubeSubs(){
    const id = "UCVxPnFAKMyWtvxodKjg5L2w";
    const key = "AIzaSyAe_ldqr7HrwXO90OhfRLuLkY9qo3Pqp8Y";

    this.http.get<any[]>(`https://www.googleapis.com/youtube/v3/channels?part=statistics&id=${id}&key=${key}`).subscribe(
      {
        next: (data: any) =>
          {
            this.youtube = data["items"][0].statistics.subscriberCount;
            this.readyCounter += 1;
            document.body.style.overflow = this.readyCounter == 4 ? "visible" : "hidden";

          },
        error: error => console.log(error)
      }
    )
  }

  getStream(){

    const tmpModal = {
      date: this.format_date(new Date(),"-",":")
    }

    this.http.post<any[]>(this.backendURL+"/api/dates", tmpModal).subscribe(
      {
        next: (data: any) =>
          {
            for (let index = 0; index < data.length; index++) {
              const element = data[index];

              if(!element.missing){
                this.nextStream = !element.missing ? element : [];
                break;
              }

            }

            if (data.length === 0) {
              this.nextStream = [];
            }
            this.readyCounter += 1;
            document.body.style.overflow = this.readyCounter == 4 ? "visible" : "hidden";

          },
        error: error => console.log(error)
      }
    )
  }

  checkNextStream(){
    try {
      return this.nextStream.length === 0;
    } catch (error) {
      return false;
    }
  }

  subConverter(type: any, follows: any[]): String{
    const subs = follows.toString();

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


  format_date(date:any, sep: any, sepHour: any, timeZone: any = 0) {
    var day = date.getDate();
    var monthIndex = date.getMonth();
    var year = date.getFullYear();

    var hour = date.getHours();
    var minutes = date.getMinutes();

    let formatted_date;
    if(hour === 0 && minutes === 0) {
      formatted_date = ("" + year) + this.zero_pad2(monthIndex + 1) + this.zero_pad2(day);
    } else {
      formatted_date = ("" + year) + sep + this.zero_pad2(monthIndex + 1) + sep + this.zero_pad2(day) + "T" + this.zero_pad2(hour-parseInt(timeZone)) + sepHour + this.zero_pad2(minutes) +sepHour + "00Z";
    }

    return formatted_date;
  }

  zero_pad2(num: any) {
    if(num < 10) return "0" + num;
      return num;
  }

  PicToBase64(pic: string){
    return "data:image/jpeg;base64," + pic;
  }

  toCorrectTime(time: any){
    const date = new Date(time);
    return date.getFullYear() + ". " + ((date.getMonth()+1) < 10 ? '0' + (date.getMonth()+1) : (date.getMonth()+1)) + ". " + ((date.getDate()) < 10 ? '0' + (date.getDate()) : (date.getDate())) + ".";
  }
}

