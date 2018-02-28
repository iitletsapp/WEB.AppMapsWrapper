import { Injectable } from '@angular/core';
import { MapsAPILoader } from '@agm/core';

@Injectable()
export class MapService {
    public map: any;
    constructor(public mapsAPILoader: MapsAPILoader) {

    }
    public startMapsAPI(settings: Function) {
        this.mapsAPILoader.load().then(() => { this.map = settings(); });
    };
    public getMap() {
        return this.map;
    }
}
