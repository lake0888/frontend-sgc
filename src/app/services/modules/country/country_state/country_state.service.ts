import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppConstants } from 'src/app/app.constants';
import { DataService } from '../../data.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CountryStateService extends DataService {

  constructor(http: HttpClient) {
    super(AppConstants.COUNTRY_STATE_API_URL, http);
   }

   public findAllByCountryCode(params: any): Observable<any> {
    return this.http.get<any>(`${ AppConstants.COUNTRY_STATE_API_URL }/findAllByCountryCode`, {params})
   }
}
