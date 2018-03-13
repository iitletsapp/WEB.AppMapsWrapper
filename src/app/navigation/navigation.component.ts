import { Component, OnInit } from '@angular/core';
import { TranslateService } from 'ng2-translate';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Globals} from '../globals';
import { GetMarkerService } from '../../services/getmarker.service';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})

export class NavigationComponent implements OnInit {
  public collapsedNav = false;
  public generalFlag = false;
  public populationFlag = false;
  public taxesFlag = false;
  public housingMarketFlag = false;
  public poiFlag = false;
  public noiseFlag = false;
  public header;

  constructor(private activatedRoute: ActivatedRoute,
    public translate: TranslateService,
    public global: Globals
  ) {
    translate.addLangs(['de', 'en']);
    translate.setDefaultLang('en');
  }

  public ngOnInit() {
    const param = this.activatedRoute.snapshot.queryParams['id'];
    console.log(param);
    if (param === 'general') {
        this.generalFlag = true;
        this.header = 'General';
    } else if (param === 'population') {
        this.populationFlag = true;
        this.header = 'Population';
    } else if (param === 'taxes') {
      this.taxesFlag = true;
      this.header = 'Tax';
    } else if (param === 'housingmarket') {
      this.housingMarketFlag = true;
      this.header = 'Housing Market';
    } else if (param === 'poi') {
      this.poiFlag = true;
      this.header = 'POI';
    } else if (param === 'noise') {
      this.noiseFlag = true;
      this.header = 'Noise';
    }
  }

  public toggleNav() {
    this.collapsedNav = !this.collapsedNav;
  }
  public onClickNavMobile() {
    if (this.collapsedNav) {
      this.toggleNav();
    }
  }


}
