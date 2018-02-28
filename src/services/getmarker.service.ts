import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class GetMarkerService {
    // Observable string sources
    public emitChangeSource = new Subject<any>();
    public changeEmitted$ = this.emitChangeSource.asObservable();
    public position;

    // Service message commands
    public emitChange(change: any) {
        this.position = change;
        this.emitChangeSource.next(change);
    }

    public requestLastPosition() {
        return this.position;
    }

}