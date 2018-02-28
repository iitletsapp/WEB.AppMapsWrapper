import { Injectable } from '@angular/core';
import { URLSearchParams, Jsonp, Http, Headers, RequestOptions } from '@angular/http';
import { MacroInfo } from '../core/macro.class';
import 'rxjs/add/operator/map';

@Injectable()
export class MacroService {
    public macroObj;
    private http: Http;

    constructor(http: Http) {
        this.http = http;
    }

    public getLocationInfo(lat: number, lng: number) {
        return this.http
            .get(`https://devservices.iazi.ch/api/LageCheck/v1/locationinfo?key=DC38C137908D86DED20414EF56137B67F832F07175AB3EEF1A5BF3C65DD293C0&countryCode=CH&lat=${lat}&lon=${lng}`)
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
        return this.http
            .get(`https://devservices.iazi.ch/api/LageCheck/v1/macroratings?key=DC38C137908D86DED20414EF56137B67F832F07175AB3EEF1A5BF3C65DD293C0&countryCode=CH&lat=${lat}&lon=${lng}`)
            .map((request) => request.json());
    }

    public getMunicipalityInfo(lat: number, lng: number) {
        return this.http
            .get(`https://devservices.iazi.ch/api/LageCheck/v1/gemeindeinfo?key=DC38C137908D86DED20414EF56137B67F832F07175AB3EEF1A5BF3C65DD293C0&countryCode=CH&lat=${lat}&lon=${lng}&ortId=${this.macroObj.ortID}&municipalityId=${this.macroObj.municipalityID}`)
            .map((request) => request.json());
    }

    public getPopulation(lat: number, lng: number) {
        return this.http
            .get(`https://devservices.iazi.ch/api/LageCheck/v1/population?key=DC38C137908D86DED20414EF56137B67F832F07175AB3EEF1A5BF3C65DD293C0&countryCode=CH&lat=${lat}&lon=${lng}&ortId=${this.macroObj.ortID}&municipalityId=${this.macroObj.municipalityID}`)
            .map((request) => request.json());
    }

    public getStreetNoise(lat: number, lng: number) {
        return this.http

            .get(`https://devservices.iazi.ch/api/LageCheck/v1/microfactors?key=DC38C137908D86DED20414EF56137B67F832F07175AB3EEF1A5BF3C65DD293C0&countryCode=CH&lat=${lat}&lon=${lng}&ortId=${this.macroObj.ortID}&municipalityId=${this.macroObj.municipalityID}&factorId=20`)
            .map((request) => request.json());
    }
    public getRailNoise(lat: number, lng: number) {
        return this.http
            .get(`https://devservices.iazi.ch/api/LageCheck/v1/microfactors?key=DC38C137908D86DED20414EF56137B67F832F07175AB3EEF1A5BF3C65DD293C0&countryCode=CH&lat=${lat}&lon=${lng}&ortId=${this.macroObj.ortID}&municipalityId=${this.macroObj.municipalityID}&factorId=19`)
            .map((request) => request.json());
    }
    public getPlaneNoise(lat: number, lng: number) {
        return this.http
            .get(`https://devservices.iazi.ch/api/LageCheck/v1/microfactors?key=DC38C137908D86DED20414EF56137B67F832F07175AB3EEF1A5BF3C65DD293C0&countryCode=CH&lat=${lat}&lon=${lng}&ortId=${this.macroObj.ortID}&municipalityId=${this.macroObj.municipalityID}&factorId=16`)
            .map((request) => request.json());
    }

}