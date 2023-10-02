import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppConstants } from 'src/app/app.constants';
import { DataService } from '../../data.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SubfamilyService extends DataService{

  constructor(http: HttpClient) { 
    super(AppConstants.SUBFAMILY_API_URL, http);
  }
}
