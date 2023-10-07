import { Injectable } from '@angular/core';
import { DataService } from '../data.service';
import { HttpClient } from '@angular/common/http';
import { AppConstants } from 'src/app/app.constants';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CoinService extends DataService {

  constructor(http: HttpClient) {
    super(AppConstants.COIN_API_URL, http);
  }

  public findAllCoin(params: any): Observable<any> {
    return this.http.get<any>(`${ AppConstants.COIN_API_URL }/findAll`, {params});
  }
}
