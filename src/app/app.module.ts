import { BrowserModule } from '@angular/platform-browser';
import { NgModule, LOCALE_ID } from '@angular/core';
import { HttpModule, Http } from '@angular/http';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { AgmCoreModule, GoogleMapsAPIWrapper } from '@agm/core';
import { AppComponent } from './app.component';
import { MapService } from '../services/map.service';
import { GeocodingService } from '../services/geocoding.service';
import { GetMarkerService } from '../services/getmarker.service';
import { GetAddressService } from '../services/getaddress.service';
import { ProgressBarService } from '../services/progressbar.service';
import { NNService } from '../services/nearestneighbour.service';
import { MacroService } from '../services/macro.service';
import { MicroService } from '../services/micro.service';
import { GetMunicipalityService } from '../services/getmunicipality.service';
import { PolygonsService } from '../services/polygons.service';
import {
  Routes,
  RouterModule,
  PreloadAllModules
} from '@angular/router';
import { TranslateModule, TranslateLoader, TranslateStaticLoader } from 'ng2-translate';
import { appRoutes } from './app.routes';
import { TeaserComponent } from './teaser/teaser.component';
import { GaugeChartComponent } from './charts/gauge-chart/gauge-chart.component';
// import { HistogramChartComponent } from './charts/histogram-chart/histogram-chart.component';
import { LineChartComponent } from './charts/line-chart/linechart.component';
import { ColorRampChartComponent } from './charts/colorramp-chart/colorramp.component';
import { HorizontalbarChartComponent } from './charts/horizontalbar-chart/horizontalbarchart.component';
import { BarChartComponent } from './charts/bar-chart/barchart.component';
import { PopulationComponent } from './population/population.component';
import { NoiseComponent } from './noise/noise.component';
import { GeoLocationComponent } from './geolocation/geolocation.component';
import { GeneralComponent } from './general/general.component';
import { MunicipalityComponent } from './municipality/municipality.component';
import { AddressComponent } from './address/address.component';
import { FurtherContentComponent } from './furthercontent/furthercontent.component';
import { TaxesComponent } from './taxes/taxes.component';
import { HousingMarketComponent } from './housingmarket/housingmarket.component';
import {HistogramChartComponent} from './charts/histogram-chart/histogram-chart.component'
import { PoiComponent } from './poi/poi.component';
import { SearchComponent } from './search/search.component';
import { StartupComponent } from './startup/startup.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NavigationComponent } from './navigation/navigation.component';
import { Globals} from './globals';
import {Config} from './appconfig/config';
import { registerLocaleData } from '@angular/common';
import localeDECH from '@angular/common/locales/de-CH';
import { MaplegendComponent } from './maplegend/maplegend.component';
import { MaplegendService } from '../services/maplegend.service';
import { IndexComponent } from './index/index.component';
import { FeaturereadyService } from '../services/featureready.service';

registerLocaleData(localeDECH);

@NgModule({
  declarations: [
    AppComponent,
    // charts
    GaugeChartComponent,
    LineChartComponent,
    ColorRampChartComponent,
    HorizontalbarChartComponent,
    BarChartComponent,
    HistogramChartComponent,
    //
    SearchComponent,
    StartupComponent,
    TeaserComponent,
    PopulationComponent,
    NoiseComponent,
    GeoLocationComponent,
    GeneralComponent,
    MunicipalityComponent,
    AddressComponent,
    FurtherContentComponent,
    PopulationComponent,
    TaxesComponent,
    HousingMarketComponent,
    PoiComponent,
    NavigationComponent,
    MaplegendComponent,
    IndexComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule.forRoot({
      provide: TranslateLoader,
      // tslint:disable-next-line:max-line-length
      useFactory: (http: Http) => new TranslateStaticLoader(http, (sessionStorage.getItem('iazimappath') === null ? Config.LAGECHECKASSETPATH : sessionStorage.getItem('iazimappath')) + '/assets/i18n', '.json'),
      deps: [Http]
    }),
    RouterModule.forRoot(appRoutes),
    NgbModule.forRoot(),
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyBFVmAfeLqztTq_UehyrHBZYxMWliHzRq4',
      libraries: ['geometry', 'places']
    }),
  ],
  providers: [
    MapService,
    GeocodingService,
    GetMarkerService,
    GetAddressService,
    ProgressBarService,
    NNService,
    MacroService,
    MicroService,
    GetMunicipalityService,
    PolygonsService,
    GoogleMapsAPIWrapper,
    MaplegendService,
    FeaturereadyService,
    Globals,
    { provide: LOCALE_ID, useValue: 'de-CH' }
  ],
  bootstrap: [AppComponent]
})


export class AppModule { }
