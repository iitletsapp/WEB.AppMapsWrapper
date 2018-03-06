import { Injectable } from '@angular/core';
import { URLSearchParams, Jsonp, Http, Headers, RequestOptions } from '@angular/http';
import { MacroInfo } from '../core/macro.class';
import 'rxjs/add/operator/map';
import { Config } from '../app/appconfig/config';

@Injectable()
export class MacroService {
    public macroObj;
    private http: Http;

    constructor(http: Http) {
        this.http = http;
    }

    public getLocationInfo(lat: number, lng: number) {
        let header = new Headers();
            header.append('Accept', 'application/json');
            // tslint:disable-next-line:max-line-length
            header.append('x', 'DC38C137908D86DED20414EF56137B67F832F07175AB3EEF1A5BF3C65DD293C0');

        return this.http
            .get(Config.APPMAPSAPI + `v1/locationinfo?countryCode=CH&lat=${lat}&lon=${lng}`, { headers: header })
            .map((request) =>
                request.json())
            .map((result) => {
                let macrocontainer = new MacroInfo();
                macrocontainer.ortID = result.results.ortId;
                macrocontainer.municipalityID = result.results.municipalityId;
                this.macroObj = macrocontainer;
                return macrocontainer;
            });
    }
    public getMacroRatings(lat: number, lng: number) {
        let header = new Headers();
            header.append('Accept', 'application/json');
            // tslint:disable-next-line:max-line-length
            header.append('x', 'DC38C137908D86DED20414EF56137B67F832F07175AB3EEF1A5BF3C65DD293C0');

        return this.http
            .get(Config.APPMAPSAPI + `v1/macroratings?countryCode=CH&lat=${lat}&lon=${lng}` , { headers: header })
            .map((request) => request.json());
    }

    public getMunicipalityInfo(lat: number, lng: number) {
        let header = new Headers();
            header.append('Accept', 'application/json');
            // tslint:disable-next-line:max-line-length
            header.append('x', 'DC38C137908D86DED20414EF56137B67F832F07175AB3EEF1A5BF3C65DD293C0');

        return this.http
            .get(Config.APPMAPSAPI + `v1/gemeindeinfo?countryCode=CH&lat=${lat}&lon=${lng}&ortId=${this.macroObj.ortID}&municipalityId=${this.macroObj.municipalityID}`
                , { headers: header })
            .map((request) => request.json());
    }

    public getPopulation(lat: number, lng: number) {
        let header = new Headers();
            header.append('Accept', 'application/json');
            // tslint:disable-next-line:max-line-length
            header.append('x', 'DC38C137908D86DED20414EF56137B67F832F07175AB3EEF1A5BF3C65DD293C0');

        return this.http
            .get(Config.APPMAPSAPI + `v1/population?countryCode=CH&lat=${lat}&lon=${lng}&ortId=${this.macroObj.ortID}&municipalityId=${this.macroObj.municipalityID}`
             , { headers: header })
            .map((request) => request.json());
    }

     public getTax(lat: number, lng: number) {
         let header = new Headers();
            header.append('Accept', 'application/json');
            // tslint:disable-next-line:max-line-length
            header.append('x', 'DC38C137908D86DED20414EF56137B67F832F07175AB3EEF1A5BF3C65DD293C0');

        return this.http
            .get(Config.APPMAPSAPI + `v1/taxcharge?countryCode=CH&lat=${lat}&lon=${lng}&ortId=${this.macroObj.ortID}&municipalityId=${this.macroObj.municipalityID}`
             , { headers: header })
            .map((request) => request.json());
    }

    public getStreetNoise(lat: number, lng: number) {
        let header = new Headers();
            header.append('Accept', 'application/json');
            // tslint:disable-next-line:max-line-length
            header.append('x', 'DC38C137908D86DED20414EF56137B67F832F07175AB3EEF1A5BF3C65DD293C0');

        return this.http
            .get(Config.APPMAPSAPI + `v1/microfactors?countryCode=CH&lat=${lat}&lon=${lng}&ortId=${this.macroObj.ortID}&municipalityId=${this.macroObj.municipalityID}&factorId=20`
             , { headers: header })
            .map((request) => request.json());
    }
    public getRailNoise(lat: number, lng: number) {
         let header = new Headers();
            header.append('Accept', 'application/json');
            // tslint:disable-next-line:max-line-length
            header.append('x', 'DC38C137908D86DED20414EF56137B67F832F07175AB3EEF1A5BF3C65DD293C0');

        return this.http
            .get(Config.APPMAPSAPI + `v1/microfactors?countryCode=CH&lat=${lat}&lon=${lng}&ortId=${this.macroObj.ortID}&municipalityId=${this.macroObj.municipalityID}&factorId=19`
             , { headers: header })
            .map((request) => request.json());
    }
    public getPlaneNoise(lat: number, lng: number) {
        let header = new Headers();
            header.append('Accept', 'application/json');
            // tslint:disable-next-line:max-line-length
            header.append('x', 'DC38C137908D86DED20414EF56137B67F832F07175AB3EEF1A5BF3C65DD293C0');

        return this.http
            .get(Config.APPMAPSAPI + `v1/microfactors?countryCode=CH&lat=${lat}&lon=${lng}&ortId=${this.macroObj.ortID}&municipalityId=${this.macroObj.municipalityID}&factorId=16`
             , { headers: header })
            .map((request) => request.json());
    }

}