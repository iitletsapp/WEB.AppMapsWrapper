import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class GetAddressService {
    // Observable string sources
    public emitChangeSource = new Subject<any>();
    public changeEmitted$ = this.emitChangeSource.asObservable();
    // Observable string streams
    public address;

    // Service message commands
    public emitChange(change: any) {
        this.address = change;
        this.emitChangeSource.next(change);
    }
    public setFormatedAddress(formatedAddress) {
        this.address = formatedAddress;
    }
    public requestAddress() {
        return this.address;
    }
}
