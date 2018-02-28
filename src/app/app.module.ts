import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
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
import {
  Routes,
  RouterModule,
  PreloadAllModules
} from '@angular/router';
import { TranslateModule } from 'ng2-translate';
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
import { PoiComponent } from './poi/poi.component';
import { SearchComponent } from './search/search.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NavigationComponent } from './navigation/navigation.component';

@NgModule({
  declarations: [
    AppComponent,
    // charts
    GaugeChartComponent,
    LineChartComponent,
    ColorRampChartComponent,
    HorizontalbarChartComponent,
    BarChartComponent,
    //
    SearchComponent,
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
    NavigationComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule.forRoot(),
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
    GoogleMapsAPIWrapper
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
