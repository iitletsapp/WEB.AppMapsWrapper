import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class GetMunicipalityService {
    // Observable string sources
    public emitChangeSource = new Subject<any>();
    public changeEmitted$ = this.emitChangeSource.asObservable();
    public apiObj = {
        general: null,
        population: null,
        taxes: null,
        market: null,
        poi: null,
        streetnoise: null,
        railnoise: null,
        planenoise: null
    }
    // Observable string streams

    // Service message commands
    public emitChange(data: any, type: string) {
        this.apiObj[type] = data;
        this.emitChangeSource.next(data);
    }

    public requestData(type: string) {
        return this.apiObj[type];
    }

}