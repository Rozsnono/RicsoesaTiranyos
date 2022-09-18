import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';

@Component({
  selector: 'app-page-not-found',
  templateUrl: './page-not-found.component.html',
  styleUrls: ['./page-not-found.component.css']
})
export class PageNotFoundComponent implements OnInit {
  isMobile: boolean;

  constructor( private _location: Location) { }

  ngOnInit(): void {
    sessionStorage.clear();

    if(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)){
      // true for mobile device
      this.isMobile = true;
    }else{
      // false for not mobile device
      this.isMobile = false;
    }
  }

  goToBack(){

    this._location.back();
  }

}
