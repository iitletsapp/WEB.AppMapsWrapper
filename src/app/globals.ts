import { Injectable } from '@angular/core';
import { Config} from '../app/appconfig/config'

@Injectable()
export class Globals {
  language: string = '';
  microQuality: number ;
  apiKey = '';
  lageCheckAssetPath = Config.LAGECHECKASSETPATH
}