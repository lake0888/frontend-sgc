import { Injectable } from '@angular/core';
import { DataService } from '../../data.service';
import { AppConstants }  from 'src/app/app.constants';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CountryService extends DataService {

  constructor(http: HttpClient) {
    super(AppConstants.COUNTRY_API_URL, http);
  }

  public findAllByName(name: string): Observable<any> {
    return this.http.get<any>(`${ this.url }/findAll/${ name }`);
  }
}
