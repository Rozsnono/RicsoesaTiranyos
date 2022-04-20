import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

import {FormControl} from '@angular/forms';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
@Component({
  selector: 'app-videos',
  templateUrl: './videos.component.html',
  styleUrls: ['./videos.component.css']
})
export class VideosComponent implements OnInit {

  constructor(private http: HttpClient) { }

  links: any[] = [];
  backendURL = "https://ricsoesatiranyos2.herokuapp.com";
  loaded: any = false;
  isEmpty: any = false;
  isAllEmpty: any = false;

  ngOnInit(): void {
    this.getAllGames();
    this.getAllLink();
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value)),
    );
  }

  myControl = new FormControl();
  options: string[] = [];
  filteredOptions: Observable<string[]>;
  selectedGameName: any;

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.options.filter(option => option.toLowerCase().includes(filterValue));
  }

  InputChange(game: any){
    console.log(game);
    this.selectedGameName = game;
  }

  getAllLink(){
    this.http.get<any[]>(this.backendURL+"/api/youtube").subscribe(
      {
        next: (data: any) => {this.links = data; this.loaded = true; this.isAllEmpty = (this.links.length == 0); },
        error: error => console.log(error)
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
    this.http.get<any[]>(this.backendURL+"/api/youtube/"+this.selectedGameName).subscribe(
      {
        next: (data: any) => {
          this.links = data; this.loaded = true; this.isEmpty = (this.links.length == 0);
        },
        error: error => console.log(error)
      }
    )
  }

  PicToBase64(pic: string){
    return "data:image/jpeg;base64," + pic;
  }

  toCorrectTime(time: any){
    const date = new Date(time);
    return date.getFullYear() + ". " + ((date.getMonth()+1) < 10 ? '0' + (date.getMonth()+1) : (date.getMonth()+1)) + ". " + ((date.getDate()-1) < 10 ? '0' + (date.getDate()-1) : (date.getDate()-1)) + ".";
  }
}
