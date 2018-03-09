import { Component, OnInit } from '@angular/core';
import { Globals} from '../globals';

@Component({
  selector: 'app-startup',
  templateUrl: './startup.component.html',
  styleUrls: ['./startup.component.scss']
})

export class StartupComponent implements OnInit {
  private backgroundImageUrl: string;
  constructor (
    public global: Globals
  ) {}

  ngOnInit() {
    this.backgroundImageUrl = this.global.lageCheckAssetPath + '/assets/img/kantons/cityimage.png';
  }
}


