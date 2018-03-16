import { Component, OnInit, OnDestroy } from '@angular/core';
import { MaplegendService } from '../../services/maplegend.service';

@Component({
  selector: 'app-maplegend',
  templateUrl: './maplegend.component.html',
  styleUrls: ['./maplegend.component.scss']
})
export class MaplegendComponent implements OnInit, OnDestroy {
  public title: string;
  public backgrounds: any[];
  public labels: any[];
  private mapLegendSubscription;

  constructor(private mapLegendService: MaplegendService) {
    // return Subscription Object that has a unsubscribe method.
    this.mapLegendSubscription = this.mapLegendService.changeEmitted$.subscribe((data) => {
      this.title = data.title;
      this.backgrounds = data.backgrounds;
      this.labels = data.labels;
    });
  }

  ngOnInit() {
  }
  ngOnDestroy() {
    this.mapLegendSubscription.unsubscribe();
  }

}
