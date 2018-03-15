import { Injectable } from '@angular/core';
import * as d3 from 'd3';

@Injectable()
export class PolygonsService {
    constructor() { }

    public zoom(map) {
        const bounds = new google.maps.LatLngBounds();
        map.data.forEach((feature) => {
            this.processPoints(feature.getGeometry(), bounds.extend, bounds);
        });
        map.fitBounds(bounds);
    }

    public processPoints(geometry, callback, thisArg) {
        if (geometry instanceof google.maps.LatLng) {
            callback.call(thisArg, geometry);
        } else if (geometry instanceof google.maps.Data.Point) {
            callback.call(thisArg, geometry.get());
        } else {
            geometry.getArray().forEach((g) => {
                this.processPoints(g, callback, thisArg);
            });
        }
    }

    public calcColor(val, extent) {
        const quant = d3.scaleQuantize()
            .domain(extent)
            .range([
                '#FFFF6B',
                '#FAC04B',
                '#FA974B',
                '#FA5A4B'])
            .nice();
        return quant(val);
    }
}
