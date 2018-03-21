import { Injectable } from '@angular/core';
import { MapsAPILoader } from '@agm/core';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class MapService {
    public map: any;
    public sourceMaps = new Subject<any>();
    public sourceMapsChangeEmitted$ = this.sourceMaps.asObservable();

    constructor(public mapsAPILoader: MapsAPILoader) {

    }
    public startMapsAPI(settings: Function) {
        this.mapsAPILoader.load().then(() => {
            this.map = settings();
            this.sourceMaps.next(this.map);
        });
    }
    public getMap() {
        if (this.map) {
            return this.map;
        }
    }
}
