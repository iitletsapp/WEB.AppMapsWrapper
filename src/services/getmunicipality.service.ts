import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { AsyncSubject } from 'rxjs/AsyncSubject';

@Injectable()
export class GetMunicipalityService {
    // Observable string sources
    public emitChangeSource = new AsyncSubject<any>();
    public changeEmitted$ = this.emitChangeSource.asObservable();
    public apiObj = {
        general: null,
        population: null,
        populationratio: null,
        taxes: null,
        market: null,
        poi: null,
        streetnoise: null,
        railnoise: null,
        planenoise: null,
        polygons: null
    };

    // Service message commands
    public emitChange(data: any, type: string) {
        this.apiObj[type] = data;
        this.emitChangeSource.next(data);
    }

    public requestData(type: string) {
        if (this.apiObj[type] !== null) {
            return this.apiObj[type];
        }
    }
}
