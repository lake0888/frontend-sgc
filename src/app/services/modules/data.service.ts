import { HttpClient, HttpEvent } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(@Inject(String) protected url: string, protected http: HttpClient) { 
  }

  public findAll(params: any): Observable<HttpEvent<any>> {
    return this.http.get<any>(this.url, {params});
  }

  public findById(id: number): Observable<any> {
    return this.http.get<any>(`${ this.url }/${ id }`);
  }

  public save(entity: any): Observable<any> {
    return this.http.post<any>(this.url, entity);
  }

  public deleteById(id: number): Observable<any> {
    return this.http.delete<any>(`${ this.url }/${ id }`);
  }

  public updateById(id: number, entity: any): Observable<any> {
    return this.http.put<any>(`${ this.url }/${ id }`, entity);
  }  

  public deleteAllById(params: any): Observable<any> {
      return this.http.delete<any>(`${ this.url }/deleteAllById`, {params});
  }

  public count(): Observable<any> {
    return this.http.get<any>(`${ this.url }/count`);
  }
}
