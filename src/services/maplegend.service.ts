import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class MaplegendService {

    // Observable string sources
    public emitChangeSource = new Subject<any>();
    public changeEmitted$ = this.emitChangeSource.asObservable();
    // attributes
    public title;
    public backgrounds;
    public labels;

    // Service message commands
    public setLegendInfo(attributes: any) {
        this.title = attributes.title;
        this.backgrounds = attributes.backgrounds;
        this.labels = attributes.labels;
        this.emitChangeSource.next(attributes);
    }
    public removeLegend() {
        this.title = '';
        this.emitChangeSource.next(this.title);
    }

}
