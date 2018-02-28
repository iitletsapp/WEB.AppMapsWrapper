import { Http, Headers, Response } from '@angular/http';
import { Location } from '../core/location.class';
import { Injectable } from '@angular/core';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';

@Injectable()
export class GeocodingService {
    private http: Http;
    private APIKEY = 'AIzaSyBFVmAfeLqztTq_UehyrHBZYxMWliHzRq4';

    constructor(http: Http) {
        this.http = http;
    }

    public autoSuggest(initAutocomplete: Function) {
        return this.http
            .get(`https://maps.googleapis.com/maps/api/js?key=${this.APIKEY}&libraries=places&callback=${initAutocomplete}`)
            .map(res => res.json())
            .map(result => {
                let res = []

                if (result.features[0].place_name !== undefined) {
                    return res = result.features.map((el) => {
                        return el.place_name;
                    })
                } else {
                    res = ["searching..."]
                    return res;
                }

            });
    }
    public geocode(address: string) {
        return this.http
            .get(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${this.APIKEY}`)
            .map(res => res.json())
            .map(result => {
                if (result.status !== 'OK') {
                    throw new Error('unable to geocode address');
                }
                let location = new Location();
                location.address = result.results[0].formatted_address;
                location.latitude = result.results[0].geometry.location.lat;
                location.longitude = result.results[0].geometry.location.lng;

                return location;
            })
    }

    public regeocode(lat: number, lng: number) {
        return this.http
            .get(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${this.APIKEY}`)
            .map(res => res.json())
            .map((result) => {
                if (result.status !== 'OK' || result.results.length < 1) {
                    throw new Error(result.error_message);
                }

                let location = new Location();
                location.address = result.results[0].formatted_address;
                location.latitude = lat;
                location.longitude = lng;

                return location;
            });
    }
}
