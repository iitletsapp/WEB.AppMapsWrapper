import { Injectable } from '@angular/core';
import { URLSearchParams, Jsonp, Http, Headers, RequestOptions } from '@angular/http';

import 'rxjs/add/operator/map';

@Injectable()
export class MicroService {
    private http: Http;

    constructor(http: Http) {
        this.http = http;
    }

    public getMicroRatings(lat: number, lng: number) {

        return this.http
            .get(`https://devservices.iazi.ch/api/LageCheck/v1/macroratings?key=DC38C137908D86DED20414EF56137B67F832F07175AB3EEF1A5BF3C65DD293C0&countryCode=CH&lat=${lat}&lon=${lng}`)
            .map((request) => request.json());
    }
}