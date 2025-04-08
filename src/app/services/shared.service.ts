import { HttpClient, HttpHeaders } from '@angular/common/http';
import { computed, Injectable, signal } from '@angular/core';
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
  favItems = signal<any[]>([]);
  FavCount = computed(() => this.favItems()?.length);

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

  setToken(token: string, role: 'user' | 'author') {
    localStorage.setItem(`eBookToken_${role}`, token);
  }

  getToken(role: 'user' | 'author') {
    return localStorage.getItem(`eBookToken_${role}`);
  }

  isLogedIn(role: 'user' | 'author') {
    return !!this.getToken(role);
  }

  logout() {
    localStorage.removeItem('eBookToken_author');
    localStorage.removeItem('eBookToken_user');
    localStorage.removeItem('userInfo');
    localStorage.removeItem('userRole');
    localStorage.removeItem('cart');
    this.cartService.cartItems.set([]);
    this.favItems.set([]);
    this.profileDataSubject.next(null);
  }

  private profileDataSubject = new BehaviorSubject<any>(null);
  profileData$ = this.profileDataSubject.asObservable();

  getProfile(url: string, role: 'user' | 'author') {
    if (this.isLogedIn(role)) {
      this.http.get(this.baseUrl + url).subscribe((res: any) => {
        this.profileDataSubject.next(res.user);
      });
    }
  }
}
