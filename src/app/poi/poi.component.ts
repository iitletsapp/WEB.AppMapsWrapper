import { Component, OnInit, NgZone, OnDestroy } from '@angular/core';
import { MapService } from '../../services/map.service';
import { GetMarkerService } from '../../services/getmarker.service';
import { MapsAPILoader } from '@agm/core';
import * as d3 from 'd3';
import * as _ from 'lodash';
import { ProgressBarService } from '../../services/progressbar.service';
import { Globals } from '../globals';
import { global } from '@angular/core/src/util';

@Component({
  selector: 'app-poi',
  templateUrl: './poi.component.html',
  styleUrls: ['./poi.component.scss']
})
export class PoiComponent implements OnInit, OnDestroy {
  public markerLastLocation: any[];
  public markerbin = {
    restaurant: [],
    shop: [],
    learn: [],
    leisure: [],
    emergency: [],
    connectivity: []
  };
  public distances = {
    restaurant: null,
    shop: null,
    learn: null,
    leisure: null,
    emergency: null,
    connectivity: null
  };
  public active = {
    restaurant: false,
    shop: false,
    learn: false,
    leisure: false,
    emergency: false,
    connectivity: false
  };
  public listResult = {
    restaurant: null,
    shop: null,
    learn: null,
    leisure: null,
    emergency: null,
    connectivity: null
  };
  public wholelist = [];
  public transitLayer;

  constructor(
    private progressbar: ProgressBarService,
    private mapService: MapService,
    private getMarker: GetMarkerService,
    private ngZone: NgZone,
    private mapsAPILoader: MapsAPILoader,
    public global: Globals) {
    this.getMarker.changeEmitted$.subscribe(
      (data) => {
        this.markerLastLocation = data;
      });
  }

  public ngOnInit() {
    //
  }

  public ngOnDestroy() {
    _.keys(this.markerbin).forEach((el) => {
      this.clearMarkers(el);
      this.active[el] = null;
    });
  }
  public getConnectivity(e) {
    this.transitLayer = new google.maps.TransitLayer();

    if (!this.active[e.target.id]) {
      this.requestpoi(e.target.id, true);
      let styledMapType = new google.maps.StyledMapType([
        {
          featureType: 'water',
          elementType: 'geometry',
          stylers: [
            {
              color: '#46bcec'
            },
            {
              visibility: 'on'
            }
          ]
        },
        {
          featureType: 'landscape',
          elementType: 'geometry',
          stylers: [
            {
              color: '#f5f5f5'
            },
            {
              lightness: 20
            }
          ]
        },
        {
          featureType: 'poi',
          elementType: 'geometry',
          stylers: [
            {
              color: '#f5f5f5'
            },
            {
              lightness: 21
            }
          ]
        },
        {
          elementType: 'labels.icon',
          stylers: [
            {
              visibility: 'off'
            }
          ]
        },
        {
          featureType: 'transit.station',
          elementType: 'labels',
          stylers: [
            {
              visibility: 'on'
            }
          ]
        }
      ]);
      this.mapService.map.mapTypes.set('bus_map', styledMapType);
      this.mapService.map.setMapTypeId('bus_map');
      this.transitLayer.setMap(this.mapService.map);
      this.active[e.target.id] = !this.active[e.target.id];
    } else {
      // ############### TODO this.transitLayer.setMap(null) is not working!!!
      this.transitLayer.setMap(null);
      let styledMapType = new google.maps.StyledMapType([
        {
          featureType: 'water',
          elementType: 'geometry',
          stylers: [
            {
              color: '#46bcec'
            },
            {
              visibility: 'on'
            }
          ]
        },
        {
          featureType: 'landscape',
          elementType: 'geometry',
          stylers: [
            {
              color: '#f5f5f5'
            },
            {
              lightness: 20
            }
          ]
        },
        {
          featureType: 'poi',
          elementType: 'geometry',
          stylers: [
            {
              color: '#f5f5f5'
            },
            {
              lightness: 21
            }
          ]
        },
        {
          elementType: 'labels.icon',
          stylers: [
            {
              visibility: 'off'
            }
          ]
        },
        {
          featureType: 'transit.station',
          elementType: 'labels',
          stylers: [
            {
              visibility: 'off'
            }
          ]
        }
      ]);
      this.mapService.map.mapTypes.set('nat_map', styledMapType);
      this.mapService.map.setMapTypeId('nat_map');
      this.wholelist = this.wholelist.filter((el) => el.type !== e.target.id);
      this.clearMarkers(e.target.id);
      this.clearMeters(e.target.id);
      this.active[e.target.id] = !this.active[e.target.id];
    }
  }

  public getCategory(e) {
    if (!this.active[e.target.id]) {
      this.progressbar.startProgressBar();
      this.requestpoi(e.target.id, false);
      this.active[e.target.id] = !this.active[e.target.id];
      this.progressbar.endProgressBar();
    } else {
      this.wholelist = this.wholelist.filter((el) => el.type !== e.target.id);
      this.clearMarkers(e.target.id);
      this.clearMeters(e.target.id);
      this.active[e.target.id] = !this.active[e.target.id];
    }
  }
  public fitZoomLevel(name, position: number[], nomarker: boolean) {
    if (!nomarker) {
      const markerCategory = this.markerbin[name];
      const bounds = new google.maps.LatLngBounds();
      for (let i = 0; i < markerCategory.length; i++) {
        bounds.extend(markerCategory[i].getPosition());
      }
      const fullbounds = bounds.extend({lat: position[0], lng: position[1]});
      this.mapService.map.fitBounds(fullbounds);
      const zoomLevel = this.mapService.map.getZoom();
      this.mapService.map.setCenter({lat: position[0], lng: position[1]});
      this.mapService.map.setZoom(zoomLevel - 1);
      console.log(fullbounds);
    }
  }

  public clearMarkers(type) {
    for (let i = 0; i < this.markerbin[type].length; i++) {
      this.markerbin[type][i].setMap(null);
    }
    this.markerbin[type].length = 0;
  }

  public clearMeters(type) {
    this.distances[type] = null;
  }

  public requestpoi(poirequested, nomarker) {
    let service;
    const position = this.getMarker.requestLastPosition();

    this.mapsAPILoader.load().then(() => {

      let alltypes = [];
      let geticonUrl;

      switch (poirequested) {
        case 'restaurant':
          alltypes = ['restaurant'];
          geticonUrl = this.global.lageCheckAssetPath + '/assets/img/icons/svgtopng/restaurant.png';
          break;
        case 'shop':
          alltypes = ['supermarket'];
          geticonUrl = this.global.lageCheckAssetPath + '/assets/img/icons/svgtopng/shops.png';
          break;
        case 'learn':
          alltypes = ['school'];
          geticonUrl = this.global.lageCheckAssetPath + '/assets/img/icons/svgtopng/learn.png';
          break;
        case 'leisure':
          alltypes = ['park'];
          geticonUrl = this.global.lageCheckAssetPath + '/assets/img/icons/svgtopng/leisure.png';
          break;
        case 'emergency':
          alltypes = ['hospital'];
          geticonUrl = this.global.lageCheckAssetPath + '/assets/img/icons/svgtopng/emergency.png';
          break;
        case 'connectivity':
          alltypes = ['transit_station'];
          geticonUrl = this.global.lageCheckAssetPath + '/assets/img/icons/svgtopng/transfermarker.png';
          break;
        default:
          geticonUrl = this.global.lageCheckAssetPath + '/assets/img/icons/svgtopng/markergeneral.png';
      }
      const infowindow = new google.maps.InfoWindow();
      service = new google.maps.places.PlacesService(this.mapService.map);
      service.nearbySearch({
        location: { lat: position[0], lng: position[1] },
        type: <any> alltypes,
        radius: 1000,
        // rankBy: google.maps.places.RankBy.DISTANCE
      }, (results, status, pagination) => {
        // console.log(results);
        this.ngZone.run(() => {

          const markerbin = [];
          const createMarker = (place) => {
            if (!nomarker) {
              const marker = new google.maps.Marker({
                map: this.mapService.map,
                icon: {
                  url: geticonUrl
                },
                position: place.geometry.location,
                animation: google.maps.Animation.DROP
              });
              google.maps.event.addListener(marker, 'click', (e) => {
                infowindow.setContent(
                  `<div class="card-body">
                      <h6>${place.name}</h6>
                      <p> <i class="fa fa-star text-success" title="rating"></i> ${place.rating} &#124; 
                      <i class="fa fa-location-arrow text-warning" title="distance"></i>
                      <b>${Math.floor(google.maps.geometry.spherical.computeDistanceBetween(from, place.geometry.location))}</b>meters</p>
                      <p> <i class="fa fa-map-marker text-primary" title="address"></i><small> ${place.vicinity}</small></p>
                  </div>`);
                infowindow.setPosition(e.latLng);
                infowindow.open(this.mapService.map);
              });
              markerbin.push(marker);
            } else {
              return false;
            }
          };

          const from = new google.maps.LatLng(position[0], position[1]);
          const distance = [];
          const list = [];
          const calcDistance = (place) => {
            distance.push(
              Math.floor(google.maps.geometry.spherical.computeDistanceBetween(from, place.geometry.location))
            );
          };
          const getListresult = (place) => {
            list.push({
              class: `${poirequested}-list`,
              type: poirequested,
              place: place.name,
              address: place.vicinity,
              distance: Math.floor(google.maps.geometry.spherical.computeDistanceBetween(from, place.geometry.location))
            });
          };

          if (status === google.maps.places.PlacesServiceStatus.OK) {

            for (let i = 0; i < results.length; i++) {
              createMarker(results[i]);
              calcDistance(results[i]);
              getListresult(results[i]);
            }
            const cb = () => {
              this.distances[poirequested] = d3.min(distance);
              this.markerbin[poirequested] = markerbin;
              this.listResult[poirequested] = list;
              _.map(this.listResult[poirequested], (el) => this.wholelist.unshift(el));
              this.wholelist = _.dropRight(_.orderBy(this.wholelist, ['distance'], ['asc']), this.wholelist.length - 10);
              this.fitZoomLevel(poirequested, position, nomarker);
            };
            return cb();
          } else if (status === 'ZERO_RESULTS') {
            console.log('not good, need to expand radius because: ', status);
            return;
          } else {
            console.log('not good reason: ', status);
            return;
          }
        });
      });
    });
  }
}
