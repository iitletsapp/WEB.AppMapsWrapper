import { Routes } from '@angular/router';
import { TeaserComponent } from './teaser/teaser.component';
import { PoiComponent } from './poi/poi.component';
import { NoiseComponent } from './noise/noise.component';
import { MunicipalityComponent } from './municipality/municipality.component';
import { AddressComponent } from './address/address.component';
import { FurtherContentComponent } from './furthercontent/furthercontent.component';
import {NavigationComponent} from './navigation/navigation.component';
import { IndexComponent } from './index/index.component';
import { StartupComponent } from './startup/startup.component';

export const appRoutes: Routes = [
    {path: '', component: StartupComponent},
    {path: 'index', component: IndexComponent, children: [
      {path: 'teaser', component: TeaserComponent, outlet: 'index'},
      {path: 'teaser/navigation', component: NavigationComponent, outlet: 'index'}
    ]}
  ];
