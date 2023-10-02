import { HttpClient, HttpEvent } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DataService } from '../data.service';
import { AppConstants } from 'src/app/app.constants';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ImageService extends DataService {

  constructor(http: HttpClient) { 
    super(AppConstants.IMAGE_API_URL, http);
  }

  public uploadFiles(formData: FormData): Observable<HttpEvent<any>> {
    return this.http.post<any>(`${ this.url }/upload`, formData, {
      reportProgress: true,
      observe: 'events'
    });
  }

  public findByFilename(filename: string): Observable<any> {
    return this.http.get(`${ this.url }/${ filename }`);
  }

  /*
  public retrieve(filename: string, flag: boolean): Observable<HttpEvent<Blob>> {
    return this.http.get(`${ this.url }/${ filename }`, {
      reportProgress: true,
      observe: 'events',
      responseType: 'blob'
    });
  }
  */
}
