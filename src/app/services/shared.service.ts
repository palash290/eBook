import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { CartService } from './cart.service';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  baseUrl = environment.baseUrl
  //isAuthenticatedSignal = signal(false);;

  constructor(private http: HttpClient, private router: Router, private cartService: CartService) { }

  get<T>(url: string): Observable<T> {
    return this.http.get<T>(this.baseUrl + url);
  };

  postAPI<T, U>(url: string, data: U): Observable<T> {
    return this.http.post<T>(this.baseUrl + url, data)
  };
  update<T, U>(url: string, data: U): Observable<T> {
    return this.http.put<T>(this.baseUrl + url, data)
  };

  delete<T>(url: string): Observable<T> {
    return this.http.delete<T>(this.baseUrl + url);
  };

  setToken(token: string) {
    localStorage.setItem('eBookToken', token)
  }

  getToken() {
    return localStorage.getItem('eBookToken')
  }

  isLogedIn() {
    return !!this.getToken();
  }

  logout() {
    localStorage.removeItem('eBookToken');
    localStorage.removeItem('userInfo');
    localStorage.removeItem('userRole');
    localStorage.removeItem('cart');
    this.cartService.cartItems.set([]);
    this.profileDataSubject.next(null);
  }

  private profileDataSubject = new BehaviorSubject<any>(null);
  profileData$ = this.profileDataSubject.asObservable();

  getProfile(url: string) {
    if (this.isLogedIn()) {
      this.http.get(this.baseUrl + url).subscribe((res: any) => {
        this.profileDataSubject.next(res.user);
      });
    }
  }
}
