import { Component, OnInit, ElementRef, ViewChild, NgZone } from '@angular/core';
import { Globals} from '../globals';
import { MapsAPILoader } from '@agm/core';
import { } from '@types/googlemaps';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GetAddressService } from '../../services/getaddress.service';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { GetMarkerService } from '../../services/getmarker.service';

@Component({
  selector: 'app-startup',
  templateUrl: './startup.component.html',
  styleUrls: ['./startup.component.scss']
})

export class StartupComponent implements OnInit {
  public address = '';
  public storageAddress: string;
  public autocomplete: any;
  public countryCode = 'CH';
  public lat;
  public lng;
  public searchControl: FormControl;

  private backgroundImageUrl: string;

  @ViewChild('focusable') public searchElementRef: ElementRef;

  constructor (
    public global: Globals,
    private mapsAPILoader: MapsAPILoader,
    private getAddress: GetAddressService,
    private ngZone: NgZone,
    private router: Router,
    private getMarker: GetMarkerService
  ) {
    this.getAddress.changeEmitted$.subscribe((newAddress) => {
      this.address = newAddress;
  });

  }

  ngOnInit() {
    this.backgroundImageUrl = this.global.lageCheckAssetPath + '/assets/img/kantons/cityimage.png';

    let autocomplete;
    this.searchControl = new FormControl();
    this.mapsAPILoader.load().then(() => {
        autocomplete = new google.maps.places.Autocomplete(
            this.searchElementRef.nativeElement,
            {
                componentRestrictions: { country: this.countryCode },
                types: [] // when emtpy it will search for all types. E.g. streets and shops
            });

        autocomplete.addListener('place_changed', () => {
            this.ngZone.run(() => {
                // get the place result
                const place: google.maps.places.PlaceResult = autocomplete.getPlace();

                // verify result
                if (place.geometry === undefined || place.geometry === null) {
                    return;
                }
                // set latitude, longitude and zoom
                this.lat = place.geometry.location.lat();
                this.lng = place.geometry.location.lng();
                this.address = place.formatted_address;
                this.global.address = this.address;
                this.global.lat = this.lat;
                this.global.lon = this.lng;
            });
        });
    });
  }


}


