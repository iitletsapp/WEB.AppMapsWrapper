import { Injectable } from '@angular/core';
import { URLSearchParams, Jsonp, Http, Headers, RequestOptions } from '@angular/http';
import { MacroInfo } from '../core/macro.class';
import 'rxjs/add/operator/map';
import { Config } from '../app/appconfig/config';
import { Globals } from '../app/globals';
import { global } from '@angular/core/src/util';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class MacroService {
    public macroObj;
    private http: Http;
    public apiKey;
    public sourceready = new Subject<any>();
    public changeEmitted$ = this.sourceready.asObservable();

    // tslint:disable-next-line:no-shadowed-variable
    constructor(http: Http, public global: Globals) {
        this.http = http;
    }

    public getLocationInfo(lat: number, lng: number) {
        this.apiKey = this.global.apiKey;
        if (this.apiKey === null || this.apiKey === '') {
            this.apiKey = Config.MAPSAPIKEY;
        }

        const header = new Headers();
        header.append('Accept', 'application/json');
        // tslint:disable-next-line:max-line-length
        header.append('x', this.apiKey);

        return this.http
            .get(Config.APPMAPSAPI + `v1/locationinfo?countryCode=CH&lat=${lat}&lon=${lng}`, { headers: header })
            .map((request) =>
                request.json())
            .map((result) => {
                console.log('in macro', result);
                const macrocontainer = new MacroInfo();
                macrocontainer.ortID = result.results.ortId;
                macrocontainer.municipalityID = result.results.municipalityId;
                this.macroObj = macrocontainer;
                this.sourceready.next(this.macroObj);
                return macrocontainer;
            });
    }
    public getAddressRatings(lat: number, lng: number, ortID) {
        return this.get(`v1/microratings?cat=1&countryCode=CH&ortId=${ortID}&lat=${lat}&lon=${lng}`);
    }

    public getMacroRatings(lat: number, lng: number, municipalityID: number) {
        return this.get(`v1/macroratings?countryCode=CH&lat=${lat}&lon=${lng}&municipalityId=${municipalityID}`);
    }

    public getMunicipalityInfo(lat: number, lng: number) {
        // tslint:disable-next-line:max-line-length
        return this.get(`v1/gemeindeinfo?countryCode=CH&lat=${lat}&lon=${lng}&ortId=${this.macroObj.ortID}&municipalityId=${this.macroObj.municipalityID}`);
    }

    public getPopulation(lat: number, lng: number) {
        // tslint:disable-next-line:max-line-length
        return this.get(`v1/population?countryCode=CH&lat=${lat}&lon=${lng}&ortId=${this.macroObj.ortID}&municipalityId=${this.macroObj.municipalityID}`);
    }

    public getTax(lat: number, lng: number) {
        // tslint:disable-next-line:max-line-length
        return this.get(`v1/taxcharge?countryCode=CH&lat=${lat}&lon=${lng}&ortId=${this.macroObj.ortID}&municipalityId=${this.macroObj.municipalityID}`);
    }

    public getHousingMarket(lat: number, lng: number) {
        // tslint:disable-next-line:max-line-length
        return this.get(`v1/housingmarket?countryCode=CH&lat=${lat}&lon=${lng}&ortId=${this.macroObj.ortID}&municipalityId=${this.macroObj.municipalityID}`);
    }

    public getStreetNoise(lat: number, lng: number) {
        // tslint:disable-next-line:max-line-length
        return this.get(`v1/microfactors?countryCode=CH&lat=${lat}&lon=${lng}&ortId=${this.macroObj.ortID}&municipalityId=${this.macroObj.municipalityID}&factorId=20`);
    }
    public getRailNoise(lat: number, lng: number) {
        // tslint:disable-next-line:max-line-length
        return this.get(`v1/microfactors?countryCode=CH&lat=${lat}&lon=${lng}&ortId=${this.macroObj.ortID}&municipalityId=${this.macroObj.municipalityID}&factorId=19`);
    }
    public getPlaneNoise(lat: number, lng: number) {
        // tslint:disable-next-line:max-line-length
        return this.get(`v1/microfactors?countryCode=CH&lat=${lat}&lon=${lng}&ortId=${this.macroObj.ortID}&municipalityId=${this.macroObj.municipalityID}&factorId=16`);
    }
    public getPolygons(lat: number, lng: number) { 
        return this.get(`v1/NeighbourPolygons?countryCode=CH&municipalityId=${this.macroObj.municipalityID}&date=20180226`);
    }

    private get(url) {
        this.apiKey = this.global.apiKey;
        if (this.apiKey === null || this.apiKey === '') {
            this.apiKey = Config.MAPSAPIKEY;
        }
        const header = new Headers();
        header.append('Accept', 'application/json');
        header.append('x', this.apiKey);

        return this.http.get(Config.APPMAPSAPI + url, { headers: header })
            .map((request) => request.json());
    }
}
