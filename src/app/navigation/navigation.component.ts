import { Component, OnInit } from '@angular/core';
import { TranslateService } from 'ng2-translate';
@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})

export class NavigationComponent implements OnInit {
  public collapsedNav = false;

  constructor(
    public translate: TranslateService
  ) {
    translate.addLangs(['de', 'en']);
    translate.setDefaultLang('en');
  }

  public ngOnInit() { }

  public toggleNav() {
    this.collapsedNav = !this.collapsedNav;
  }
  public onClickNavMobile() {
    if (this.collapsedNav) {
      this.toggleNav();
    }
  }

}
