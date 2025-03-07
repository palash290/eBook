import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  apiUrl = environment.baseUrl

  constructor(private http: HttpClient, private route: Router) { }

  setToken(token: string) {
    localStorage.setItem('eBookToken', token)
  }

  isLogedIn() {
    return this.getToken() !== null;
  }

  getToken() {
    return localStorage.getItem('eBookToken')
  }

  getRole() {
    const jaonData: any = localStorage.getItem('fbRole');
    const data = JSON.parse(jaonData)
    return data
  }

  loginUser(url: any, params: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded'
    });
    return this.http.post<any>(this.apiUrl + url, params, { headers: headers });
  }

  resetPassword(url: any, params: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded'
    });
    return this.http.post<any>(this.apiUrl + url, params, { headers: headers });
  }

  getApi(url: any): Observable<any> {
    const authToken = localStorage.getItem('eBookToken');
    const headers = new HttpHeaders({

      'Authorization': `Bearer ${authToken}`
    });
    return this.http.get(this.apiUrl + url, { headers: headers })
  };

  putApi(url: any, params: any): Observable<any> {
    const authToken = localStorage.getItem('eBookToken');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${authToken}`
    });
    return this.http.put(this.apiUrl + url, params, { headers: headers })
  };

  postAPI(url: any, data: any): Observable<any> {
    const authToken = localStorage.getItem('eBookToken');
    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': `Bearer ${authToken}`
    });
    return this.http.post(this.apiUrl + url, data, { headers: headers })
  };

  postAPIFormData(url: any, data: any): Observable<any> {
    const authToken = localStorage.getItem('eBookToken');
    const headers = new HttpHeaders({
      //'Content-Type': 'multipart/form-data',
      'Authorization': `Bearer ${authToken}`
    });
    return this.http.post(this.apiUrl + url, data, { headers: headers })
  };

  postAPIFormDataPatch(url: any, data: any): Observable<any> {
    const authToken = localStorage.getItem('eBookToken');
    const headers = new HttpHeaders({
      //'Content-Type': 'multipart/form-data',
      'Authorization': `Bearer ${authToken}`
    });
    return this.http.patch(this.apiUrl + url, data, { headers: headers })
  };

 

  logout() {
    localStorage.removeItem('eBookToken');
  }

  deleteAcc(url: any): Observable<any> {
    const authToken = localStorage.getItem('eBookToken');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${authToken}`
    });
    return this.http.delete(this.apiUrl + url, { headers: headers })
  };
 
}
