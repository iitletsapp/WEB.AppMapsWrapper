import { Injectable } from '@angular/core';
import { Config} from '../app/appconfig/config';

@Injectable()
export class Globals {
  language = 'de';
  microQuality: number ;
  apiKey = '';
  lageCheckAssetPath = Config.LAGECHECKASSETPATH;
  addressSearch = false;
  macroData: any;
  addressData: any;
  address: any;
  lat: any;
  lon: any;
  muncipalityId: number;
  muncipalityName: any;
}
