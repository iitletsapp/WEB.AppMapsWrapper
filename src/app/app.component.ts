import { Component, OnInit, ViewEncapsulation, OnChanges, NgZone } from '@angular/core';
import { Globals } from '../app/globals';
import { Config } from './appconfig/config';
import { global } from '@angular/core/src/util';
import { TranslateService } from 'ng2-translate';

/**
 * App Component
 * Top Level Component
 */
@Component({
  selector: 'iazi-map-root',
  templateUrl: './app.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./app.component.scss'],
  providers: []
})
export class AppComponent implements OnInit {

  constructor(
    private ngZone: NgZone,
    public global: Globals,
    public translate: TranslateService
  ) {
    let defaultLang = this.global.language;
    translate.addLangs(['en', 'de']);
    translate.setDefaultLang(this.global.language);

    translate.use(this.global.language);
    console.log("language=", defaultLang);
  }

  public ngOnInit() {
    window.my = window.my || {};
    window.my.namespace = window.my.namespace || {};
    window.my.namespace.publicFunc = this.publicFunc.bind(this);
    window.my.namespace.microQuality = this.microQuality.bind(this);
    window.my.namespace.setApiKey = this.setApiKey.bind(this);
    window.my.namespace.quality = this.global.microQuality;
  }

  // tslint:disable-next-line:use-life-cycle-interface
  ngOnDestroy() {
    window.my.namespace.publicFunc = null;
    window.my.namespace.microQuality = null;
    window.my.namespace.setApiKey = null;
    window.my.namespace.quality = null;
  }

  public publicFunc(language: string) {
    this.ngZone.run(() => this.privateFunc(language));
  }

  private privateFunc(language: string) {
    console.log('Called from JS Wrapper');
    this.global.language = language;
    this.translate.use(this.global.language);
    window.my.namespace.quality = this.global.microQuality;
    console.log(this.global.language);
  }

  public microQuality(quality: any) {
    this.ngZone.run(() => this.privatemicroQuality(quality));
  }

  private privatemicroQuality(quality: any) {
    console.log('Called from MicroQuality');
    console.log('MicroQuality :' + this.global.microQuality);
    // return this.globals.microQuality;
  }

  public setApiKey(apiKey: string) {
    this.ngZone.run(() => this.privateSetApiKey(apiKey));
  }

  private privateSetApiKey(apiKey: string) {
    this.global.apiKey = apiKey;
    console.log('API key: ' + this.global.apiKey);
  }


}

