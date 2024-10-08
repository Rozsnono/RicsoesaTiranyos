import { DOCUMENT } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';

import {FormControl} from '@angular/forms';
import { Router } from '@angular/router';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
@Component({
  selector: 'app-videos',
  templateUrl: './videos.component.html',
  styleUrls: ['./videos.component.css']
})
export class VideosComponent implements OnInit {

  constructor(private http: HttpClient,private router: Router, @Inject(DOCUMENT) private dom: Document) { }

  links: any[] = [];
  NotSeriesLinks: any[] = [];

  SeriesNowArray: any[] = [];
  SeriesBackArray: any[] = [];
  NoSeriesNow: Boolean = false;
  NoSeriesBack: Boolean = false;
  SeriesSearchArray: any[] = [];

  choosenType: Number = 0;

  backendURL = "https://ricsoesatiranyosbackend.herokuapp.com";

  loaded: any = false;
  isEmpty: any = false;
  isAllEmpty: any = false;

  seriesArray: any = [];
  chosenSeries: any;


  ngOnInit(): void {
    sessionStorage.clear();
    this.getRoute();
    this.getAllGames();
    this.getAllLink();
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value)),
    );

    if(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)){
      // true for mobile device
      this.isMobile = true;
    }else{
      // false for not mobile device
      this.isMobile = false;
    }
  }

  isMobile: boolean = false;

  myControl = new FormControl();
  options: string[] = [];
  filteredOptions: Observable<string[]>;
  selectedGameName: any;

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.options.filter(option => option.toLowerCase().includes(filterValue));
  }

  InputChange(game: any){
    if(game){
      this.choosenType = 2;
      this.selectedGameName = game;

      this.http.get<any[]>(this.backendURL+"/api/youtube").subscribe(
        {
          next: (data: any) => {
            this.SeriesSearchArray = data;
            this.SeriesSearchArray = this.SeriesSearchArray.filter(x => x.name.toLowerCase().includes(game.toLowerCase()));
            this.loaded = true; this.isEmpty = (this.SeriesSearchArray.length == 0);
          },
          error: error => console.log(error)
        }
        )
    }else{
      this.choosenType = 0;
      this.SeriesBackArray = this.SeriesBackArray.filter(x => !x.running);
    }
  }

  getRoute(){
    this.http.get<any[]>(this.backendURL+"/api/pages").subscribe(
      {
        next: (data: any[]) => {
          if(data.filter(x => x.route === "videok")[0].disabled){
            this.router.navigateByUrl('/not-found');
          }else{
          }

        },
        error: error => console.log(error)
      }
    )
  }



  getAllLink(){
    this.loaded = false;
    this.http.get<any[]>(this.backendURL+"/api/youtube").subscribe(
      {
        next: (data: any) => {
          this.links = data;
          this.loaded = true;

          this.SeriesNowArray = data;
          this.SeriesNowArray = this.SeriesNowArray.filter(x => x.running);

          this.NoSeriesNow = (this.SeriesNowArray.length === 0);

          this.SeriesBackArray = data;
          this.SeriesBackArray = this.SeriesBackArray.filter(x => !x.running);


          this.NoSeriesBack = (this.SeriesBackArray.length === 0);

        },
        error: error => {console.log(error); this.router.navigateByUrl('/not-found');}
      }
    )
  }

  getAllGames(){
    this.http.get<any[]>(this.backendURL+"/api/games").subscribe(
      {
        next: (data: any) => {
          for (let index = 0; index < data.length; index++) {
            this.options.push(data[index].name);
          }
        },
        error: error => console.log(error)
      }
    )
  }

  getLinkByName(){

    this.http.get<any[]>(this.backendURL+"/api/youtube").subscribe(
      {
        next: (data: any) => {
          this.NotSeriesLinks = data;
          if(!this.isMobile){
            this.NotSeriesLinks = this.NotSeriesLinks.filter(x => !x.name.includes('#'));
          }
          this.NotSeriesLinks = this.NotSeriesLinks.filter(x => x.name.includes(this.selectedGameName));
          this.loaded = true; this.isEmpty = (this.SeriesBackArray.length == 0);
        },
        error: error => console.log(error)
      }
    )



    // this.http.get<any[]>(this.backendURL+"/api/youtube/"+this.selectedGameName).subscribe(
    //   {
    //     next: (data: any) => {
    //       this.links = data;
    //     },
    //     error: error => console.log(error)
    //   }
    // )
  }

  PicToBase64(pic: string){
    return "data:image/jpeg;base64," + pic;
  }

  toCorrectTime(time: any){
    const date = new Date(time);
    return date.getFullYear() + ". " + ((date.getMonth()+1) < 10 ? '0' + (date.getMonth()+1) : (date.getMonth()+1)) + ". " + ((date.getDate()) < 10 ? '0' + (date.getDate()) : (date.getDate())) + ".";
  }

  getSeriesLinkByNameAndPage(name: any, page: any)
  {

    const tmpArray = this.links.filter(x => x.name.includes(name)).reverse().splice((page-1)*4,4);

    return tmpArray;
  }

  getSeriesPageNumber(name: any){
    let tmpArray = [];

    const tmpLength = this.links.filter(x => x.name.includes(name)).length / 4 + (this.links.filter(x => x.name.includes(name)).length % 4 === 0 ? 0 : 1)

    for (let index = 1; index <= tmpLength; index++) {
      tmpArray.push(index);
    }
    return tmpArray;
  }


  getChoosenArray(): any{
    if(this.choosenType === 0){
      return this.SeriesNowArray;
    }else if(this.choosenType === 2){
      return this.SeriesSearchArray;
    }
    return this.SeriesBackArray;
  }





  changeChoosenNumber(number: number){
    if (number !== this.choosenType) {
      this.scroll();
      this.choosenType = number;
      this.getAllLink();
    }
  }

  scroll(){
    this.dom.body.scrollTop =0;
    this.dom.documentElement.scrollTop=0;
  }

}
