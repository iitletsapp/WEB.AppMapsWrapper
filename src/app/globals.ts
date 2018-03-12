import { Injectable } from '@angular/core';
import { Config} from '../app/appconfig/config';

@Injectable()
export class Globals {
  language = 'en';
  microQuality: number ;
  apiKey = '';
  lageCheckAssetPath = Config.LAGECHECKASSETPATH;
  addressSearch = false;
  macroData: any;
  addressData: any;
}
