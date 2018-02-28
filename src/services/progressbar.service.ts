import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class ProgressBarService {
    public progressbarValue: number = 0;
    public emitChangeSource = new Subject<any>();
    public changeEmitted$ = this.emitChangeSource.asObservable();

    // Simply import this service to the component you desire and use method startProgressBar() and endProgressBar()!
    public emitChange() {
        this.emitChangeSource.next(this.progressbarValue);
    }
    public startProgressBar() {
        this.progressbarValue += Math.random() * (40 - 10 + 1);
        this.emitChange();
    }
    public endProgressBar() {
        this.progressbarValue = 100;
        this.emitChange();
        setTimeout(() => {
            this.progressbarValue = 0;
            this.emitChange();
        }, 900);
    }
}
