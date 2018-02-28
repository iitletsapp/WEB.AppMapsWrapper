import { Routes } from '@angular/router';
import { TeaserComponent } from './teaser/teaser.component';
import { PoiComponent } from './poi/poi.component';
import { NoiseComponent } from './noise/noise.component';
import { MunicipalityComponent } from './municipality/municipality.component';
import { AddressComponent } from './address/address.component';
import { FurtherContentComponent } from './furthercontent/furthercontent.component';

export const appRoutes: Routes = [
    {path: '', component: TeaserComponent},
    {path: 'poi', component: PoiComponent},
    {path: 'furthercontent', component: FurtherContentComponent},
    {path: 'furthercontent/municipality', component: MunicipalityComponent},
    {path: 'furthercontent/address', component: AddressComponent},
    {path: 'furthercontent/address/noise', component: NoiseComponent},
  ];
