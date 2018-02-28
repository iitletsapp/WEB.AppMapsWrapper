import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class GetAddressService {
    // Observable string sources
    public emitChangeSource = new Subject<any>();
    public changeEmitted$ = this.emitChangeSource.asObservable();
    // Observable string streams

    // Service message commands
    public emitChange(change: any) {
        this.emitChangeSource.next(change);
    }
}