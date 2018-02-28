import { Injectable } from '@angular/core';
import { URLSearchParams, Jsonp, Http, Headers, RequestOptions } from '@angular/http';

import 'rxjs/add/operator/map';

@Injectable()
export class NNService {
  private http: Http;

  constructor(http: Http) {
    this.http = http;
  }

  public getNN(lat: number, lng: number, compared: number) {
    let headers = new Headers();
    headers.append('Authorization',
      'bearer ew0KICAiYWxnIjogIkhTMjU2IiwNCiAgInR5cCI6ICJKV1QiDQp9.ew0KICAiZW1haWwiOiAibWVuZG9uY2FAaWF6aS5jaCIsDQogICJjdXN0b21lck5hbWUiOiAiSUFaSSIsDQogICJ1c2VySWQiOiAiNzE3MiIsDQogICJjdXN0b21lcklkIjogIjY1IiwNCiAgImFwcERhdGEiOiB7DQogICAgIm5lYXJlc3ROZWlnaGJvdXIiOiB7DQogICAgICAiYWN0aXZlIjogdHJ1ZSwNCiAgICAgICJ1c2VyTW9kZSI6IDINCiAgICB9DQogIH0sDQogICJpYXQiOiAxNTE4NTE2Mzc5LA0KICAiZXhwIjogMTUxODYwMjc3OSwNCiAgImF1ZCI6ICJpSmJxWFRqOW9FVE1aWldXN3E2Y1JDeWdOUTRWQzBvVSIsDQogICJpc3MiOiAiaHR0cHM6Ly93d3cuaWF6aS5jaC9kZXYiDQp9.aU2qA66zXIZd-hPjfrqQoYAIaAOE4oIHEFUXJgL263g');

    let opts = new RequestOptions();
    opts.headers = headers;

    return this.http
      .get(`https://devservices.iazi.ch/api/nearestneighbour/v2/offeredData?latitude=${lat}&longitude=${lng}&objectType=1&nbComparableProperties=${compared}`, opts)
      .map((request) => request.json());
  }
}
