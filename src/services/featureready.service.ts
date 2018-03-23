import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class FeaturereadyService {

    // Observable string sources
    public featureReadySource = new Subject<any>();
    public changeEmitted$ = this.featureReadySource.asObservable();

    public featuresready = {
      general: false,
      popultaion: false,
      taxes: false,
      Market: false,
      poi: false,
      noise: false
    };

    // Service message commands
    public emitIsReady(change: boolean, type: string) {
        this.featuresready[type] = change;
        this.featureReadySource.next(this.featuresready);
    }
    public requestFeaturesReadyObject() {
        return this.featuresready;
    }
}
