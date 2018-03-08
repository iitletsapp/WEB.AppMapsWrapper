import { Component, OnInit } from '@angular/core';
import { GetMarkerService } from '../../services/getmarker.service';
import { MacroService } from '../../services/macro.service';
import { GetMunicipalityService } from '../../services/getmunicipality.service';

@Component({
  selector: 'app-population',
  templateUrl: './population.component.html',
  styleUrls: ['./population.component.scss']
})

export class PopulationComponent implements OnInit {
  public population;
  public dataforlinearray;
  public xLabel = 'population';

  constructor(
    private municipality: GetMunicipalityService
  ) {
    this.population = this.municipality.requestData('population');
  }

  public ngOnInit() {
    this.dataforlinearray = this.population.map((el) => {
      return { year: el.publishDate.toString().substring(0, 4), value: Math.floor(el.municipalityValue) };
    });
  }

}
