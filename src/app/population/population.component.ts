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
  public populationrate;
  public populationratio;
  public foreignerquota;
  public unemploymentrate;
  public incometaxperson;
  public populationgrowth;
  // linechart
  public linecontainer = 'populationlinechart';
  public dataforlinearray;
  public xLabel = 'population';

  constructor(
    private municipality: GetMunicipalityService
  ) {
    this.population = this.municipality.requestData('population');
    this.populationratio = this.municipality.requestData('populationratio');     
  }

  public ngOnInit() {
    this.dataforlinearray = this.population.map((el) => {
      return { year: el.publishDate.toString().substring(0, 4), value: Math.floor(el.municipalityValue) };
    });

    this.populationrate = this.populationratio[0].municipalityValue;
    this.foreignerquota = this.populationratio[2].municipalityValue;
    this.unemploymentrate = this.populationratio[4].municipalityValue;
    this.incometaxperson = Math.floor(this.populationratio[3].municipalityValue);
    this.populationgrowth = this.populationratio[1].municipalityValue;
  }

}
